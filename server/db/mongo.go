package mongo

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DB_Name = "ai-game" // 默认数据库名称
	myMongoURL = "localhost:27017" 
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