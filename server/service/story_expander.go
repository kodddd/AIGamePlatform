package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/model"
	"context"
)

func ExpandStory(ctx context.Context, request *model.ExpandStoryRequest) (*model.ExpandStoryResult, error) {
	response := model.ExpandStoryResponse{}
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
				Content: `你是一名专业的游戏世界观架构师，正在处理一个` + request.Genre + `题材的设定扩写任务，请尽量契合题材的同时保持原始设定的核心思想不变扩展用户提供的文本`,
			},
		},
		Temperature:     request.Casualty,
		PresencePenalty: request.Creativity,
	}
	client := deepseek.NewSSPClient()
	communicateResponse, err := client.Communicate(ctx, &communicateRequest)
	if err != nil {
		return &model.ExpandStoryResult{
			Code:    500,
			Message: "agent error",
		}, err
	}
	response.Content = communicateResponse.Choices[0].Message.Content
	// 将输出结果持久化 todo
	return &model.ExpandStoryResult{
		Code:     200,
		Message:  "success",
		Response: &response,
	}, nil
}
