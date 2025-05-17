package redis

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
    RedisAddr     = "localhost:6379" // 默认Redis地址
    RedisPassword = ""               // 如果没有密码就留空
    RedisDB       = 0                // 默认DB 0

	EmptyErr = redis.Nil // Redis空值错误
)

var (
    singleClient *redis.Client // 单例 Redis 客户端
    initMutex    sync.Mutex    // 初始化互斥锁
)

// Init 初始化 Redis 客户端连接
func Init() {
    initMutex.Lock()
    defer initMutex.Unlock()

    if singleClient != nil {
        return
    }

    singleClient = redis.NewClient(&redis.Options{
        Addr:     RedisAddr,
        Password: RedisPassword,
        DB:       RedisDB,
    })

    // 测试连接
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := singleClient.Ping(ctx).Err(); err != nil {
        log.Fatalf("Redis连接失败: %v", err)
    }

    log.Println("Redis连接成功!")
}

// Client 封装Redis客户端和上下文
type Client struct {
    *redis.Client
    ctx context.Context
}

// GetClient 返回Redis单例客户端
func GetClient(ctx context.Context) *Client {
    if singleClient == nil {
        Init()
    }
    return &Client{
        Client: singleClient,
        ctx:    ctx,
    }
}

// Set 设置Key-Value
func (c *Client) SetWithExpiration(key string, value interface{}, expiration time.Duration) error {
    return c.Client.Set(c.ctx, key, value, expiration).Err()
}

// Set 设置Key-Value，默认过期时间为24hour
func (c *Client) Set(key string, value interface{}) error {
    return c.Client.Set(c.ctx, key, value, 24*time.Hour).Err()
}

// Get 获取Key值
func (c *Client) Get(key string) (string, error) {
    return c.Client.Get(c.ctx, key).Result()
}

// Delete 删除Key
func (c *Client) Delete(key string) error {
    return c.Client.Del(c.ctx, key).Err()
}

// Exists 检查Key是否存在
func (c *Client) Exists(key string) (bool, error) {
    count, err := c.Client.Exists(c.ctx, key).Result()
    return count > 0, err
}

// Increment 递增值
func (c *Client) Increment(key string) (int64, error) {
    return c.Client.Incr(c.ctx, key).Result()
}

// Decrement 递减值
func (c *Client) Decrement(key string) (int64, error) {
    return c.Client.Decr(c.ctx, key).Result()
}
