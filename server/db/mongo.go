package mongo

import (
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DB_Name = "ai-game" // 默认数据库名称
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

	mongodbUrl := os.Getenv("MONGODB_URL")
	if mongodbUrl == "" {
		panic("MONGODB_URL 环境变量未设置")
	}

	mongodbUrl = fmt.Sprintf("mongodb://%s", mongodbUrl)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	client, err := mongo.Connect(
	ctx,
	options.Client().ApplyURI(mongodbUrl),
)

	if err != nil {
		panic(fmt.Sprintf("MongoDB连接失败: %v", err))
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