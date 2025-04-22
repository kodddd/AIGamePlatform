package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ExpandStory(ctx context.Context, request *model.ExpandStoryRequest) (*model.ExpandStoryResult, error) {
	response := model.ExpandStoryResponse{}
	agentErrorResult := model.ExpandStoryResult{
		Code:    500,
		Message: "agent error",
	}
	communicateRequest := model.CommunicateRequest{
		Model:  model.DefaultDeepseekModel,
		Stream: false,
		Messages: []model.ChatMessage{
			{
				Role:    "user",
				Content: request.Text,
			},
			{
				Role:    "system",
				Content: `你是一名专业的游戏世界观架构师，正在处理一个` + request.Genre + `题材的世界观扩写任务，请尽量契合题材的同时保持原始设定的核心思想不变，根据用户提供的文本来生成世界观`,
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
		return nil, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	err = UpdateAccountStats(ctx, objID, "story_expansion")
	if err != nil {
		return &agentErrorResult, err
	}
	return &model.ExpandStoryResult{
		Code:     200,
		Message:  "success",
		Response: &response,
	}, nil
}
