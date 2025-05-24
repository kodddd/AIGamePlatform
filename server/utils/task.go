package utils

import (
	"AIGamePlatform/server/db/redis"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
)

type TaskStatus struct {
    Status string `json:"status"`
    Result string `json:"result"`
    Type   string `json:"type"`
}

func SaveTaskStatus(ctx context.Context,taskID, status, result,taskType string) error {
    rdb := redis.GetClient(ctx)
    // 构建任务状态
    taskStatus := TaskStatus{
        Status: status,
        Result: result,
        Type:   taskType,
    }

    // 序列化为JSON
    jsonData, err := json.Marshal(taskStatus)
    if err != nil {
        return fmt.Errorf("JSON序列化失败: %v", err)
    }
    return rdb.Set(taskID, jsonData)
}

func UpdateTaskStatus(ctx context.Context,taskID, status, result,taskType string) {
    err := SaveTaskStatus(ctx,taskID, status, result,taskType)
    if err != nil {
        log.Printf("更新任务状态失败: %v", err)
    }
}

// GetTaskStatus 从Redis获取任务状态和结果
func GetTaskStatus(ctx context.Context,taskID string) (*TaskStatus, error) {
    rdb := redis.GetClient(ctx)
    // 从Redis获取数据
    jsonData, err := rdb.Get(taskID)
    if err == redis.EmptyErr {
        return nil, fmt.Errorf("任务ID %s 不存在", taskID)
    } else if err != nil {
        return nil, fmt.Errorf("获取任务状态失败: %v", err)
    }

    // 反序列化为结构体
    var taskStatus TaskStatus
    err = json.Unmarshal([]byte(jsonData), &taskStatus)
    if err != nil {
        return nil, fmt.Errorf("JSON解析失败: %v", err)
    }

    return &taskStatus, nil
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

// GenerateTaskID 生成唯一任务ID
func GenerateTaskID() string {
    b := make([]byte, 8)
    _, err := rand.Read(b)
    if err != nil {
        log.Fatal("生成任务ID失败:", err)
    }
    return hex.EncodeToString(b)
}