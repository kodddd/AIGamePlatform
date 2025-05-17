package utils

import (
	"AIGamePlatform/server/db/redis"
	"context"
	"crypto/rand"
	"encoding/hex"
	"log"
)

func SaveJobStatus(ctx context.Context,jobID, status, result string) error {
    rdb := redis.GetClient(ctx)
    return rdb.Set(jobID, status+":"+result)
}

func UpdateTaskStatus(ctx context.Context,jobID, status, result string) {
    err := SaveJobStatus(ctx,jobID, status, result)
    if err != nil {
        log.Printf("更新任务状态失败: %v", err)
    }
}

// GetJobStatus 从Redis获取任务状态和结果
func GetJobStatus(jobID string) (string, string, error) {
    ctx := context.Background()
    rdb := redis.GetClient(ctx)
    value, err := rdb.Get(jobID)
    if err == redis.EmptyErr {
        return "", "", nil
    } else if err != nil {
        return "", "", err
    }

    parts := splitStatus(value)
    return parts[0], parts[1], nil
}

// splitStatus 分离状态和结果
func splitStatus(value string) [2]string {
    parts := [2]string{"unknown", ""}
    if idx := len(value) - 1; idx > 0 {
        parts[0] = value[:idx]
        parts[1] = value[idx+1:]
    }
    return parts
}

// GenerateJobID 生成唯一任务ID
func GenerateJobID() string {
    b := make([]byte, 8)
    _, err := rand.Read(b)
    if err != nil {
        log.Fatal("生成任务ID失败:", err)
    }
    return hex.EncodeToString(b)
}