package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ExpandStory(ctx context.Context, request *model.ExpandStoryRequest,jobID string) (*model.ExpandStoryResult, error) {
	response := model.ExpandStoryResponse{}
	agentErrorResult := model.ExpandStoryResult{
		Code:    500,
		Message: "agent error",
	}
	basicErrorResult := model.ExpandStoryResult{
		Code:    500,
		Message: "server error",
	}
	communicateRequest := model.CommunicateRequest{
		Model:  model.DefaultDeepseekModel,
		Stream: false,
		Messages: []model.ChatMessage{
			{
				Role: "system",
				Content: fmt.Sprintf(`你是一名资深的游戏世界观架构师，专注于%s题材的世界观设计。请基于用户提供的核心设定进行扩写，保持原始设定的精髓，同时拓展出丰富的细节。要求：
					1. 保持题材特色和原始设定核心
					2. 扩展地理、历史、文化、势力等要素
					3. 字数控制在500字以内
					4. 输出结构清晰的世界观文档`, request.Genre),
			},
			{
				Role:    "user",
				Content: fmt.Sprintf("原始世界观核心设定：\n%s\n\n请基于以上内容进行专业扩写，特别注意%s题材的典型元素体现。", request.Text, request.Genre),
			},
		},
		Temperature:     request.Casualty,
		PresencePenalty: request.Creativity,
	}
	client := deepseek.NewSSPClient()
	communicateResponse, err := client.Communicate(ctx, &communicateRequest)
	if err != nil {
		return &agentErrorResult, err
	}
	response.Content = communicateResponse.Choices[0].Message.Content
	// 增加用户统计次数
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return &basicErrorResult, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return &basicErrorResult, err
	}
	err = UpdateAccountStats(ctx, objID, "story_expansion")
	if err != nil {
		return &basicErrorResult, err
	}
	return &model.ExpandStoryResult{
		Code:     200,
		Message:  "success",
		Response: &response,
	}, nil
}
