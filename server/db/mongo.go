package mongo

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DB_Name = "ai-game" // 默认数据库名称
	myMongoURL = "localhost:27010" 
	myUserName = "root"    // 如果需要认证
    myPassword = "example"    // 如果需要认证
)

var (
	singleClient               *mongo.Client             // 单例 MongoDB 客户端实例
	initMutex                sync.Mutex                 // 初始化锁，防止并发初始化
)

// Init 初始化 MongoDB 客户端连接
func Init() {
    initMutex.Lock()
    defer initMutex.Unlock()

    if singleClient != nil {
        return
    }

    // 构造连接字符串
    var uri string
    if myUserName != "" && myPassword != "" {
        uri = fmt.Sprintf("mongodb://%s:%s@%s", myUserName, myPassword, myMongoURL)
    } else {
        uri = fmt.Sprintf("mongodb://%s", myMongoURL)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
    if err != nil {
        panic(fmt.Sprintf("MongoDB连接失败: %v", err))
    }

    // 建议添加ping检查
    if err = client.Ping(ctx, nil); err != nil {
        panic(fmt.Sprintf("MongoDB连接测试失败: %v", err))
    }

    singleClient = client
}

type Client struct {
	*mongo.Client
	ctx context.Context
}

func GetClient(ctx context.Context) *Client {
	if singleClient == nil {
		Init()
	}
	return &Client{
		Client: singleClient,
		ctx:    ctx,
	}
}

func (c *Client) C(collection string) *mongo.Collection {
	return c.Database(DB_Name).Collection(collection)
}

func (c *Client) Insert(collection string, docs ...interface{}) (*mongo.InsertManyResult, error) {
	return c.C(collection).InsertMany(c.ctx, docs)
}

func (c *Client) InsertOne(collection string, doc interface{}) (*mongo.InsertOneResult, error) {
	return c.C(collection).InsertOne(c.ctx, doc)
}

func (c *Client) Find(collection string, query interface{}, result interface{}) error {
	cur, err := c.C(collection).Find(c.ctx, query)
	if err != nil {
		return err
	}
	defer cur.Close(c.ctx)
	return cur.All(c.ctx, result)
}

func (c *Client) FindOneAndGetID(collection string, query interface{}) (string, error) {
    var result struct {
        ID interface{} `bson:"_id"`
    }
    err := c.C(collection).FindOne(c.ctx, query).Decode(&result)
    if err != nil {
        return "", err
    }
    return result.ID.(primitive.ObjectID).Hex(), nil
}

func (c *Client) FindWithOptions(collection string, query interface{}, opts *options.FindOptions, result interface{}) error {
	cur, err := c.C(collection).Find(c.ctx, query, opts)
	if err != nil {
		return err
	}
	defer cur.Close(c.ctx)
	return cur.All(c.ctx, result)
}

func (c *Client) FindOne(collection string, query interface{}, result interface{}) error {
	return c.C(collection).FindOne(c.ctx, query).Decode(result)
}

func (c *Client) FindCount(collectionName string, filter interface{}) (int, error) {
    count, err := c.C(collectionName).CountDocuments(c.ctx, filter)
    if err != nil {
        return 0, fmt.Errorf("count documents failed in collection %s: %w", collectionName, err)
    }
    return int(count), nil
}

func (c *Client) FindCountWithOptions(
    collectionName string,
    filter interface{},
    opts *options.CountOptions,
) (int, error) {
    count, err := c.C(collectionName).CountDocuments(c.ctx, filter, opts)
    if err != nil {
        return 0, fmt.Errorf("count documents with options failed: %w", err)
    }
    return int(count), nil
}

func (c *Client) UpdateOne(collection string, filter, update interface{}, opts ...*options.UpdateOptions) (*mongo.UpdateResult, error) {
	return c.C(collection).UpdateOne(c.ctx, filter, update, opts...)
}

func (c *Client) ReplaceOne(collection string, filter, replacement interface{}, opts ...*options.ReplaceOptions) (*mongo.UpdateResult, error) {
	return c.C(collection).ReplaceOne(c.ctx, filter, replacement, opts...)
}

func (c *Client) DeleteOne(collection string, filter interface{}, opts ...*options.DeleteOptions) (*mongo.DeleteResult, error) {
	return c.C(collection).DeleteOne(c.ctx, filter, opts...)
}

func (c *Client) Count(collection string, filter interface{}, opts ...*options.CountOptions) (int64, error) {
	return c.C(collection).CountDocuments(c.ctx, filter, opts...)
}