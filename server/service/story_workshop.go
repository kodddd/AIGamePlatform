package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GenerateStory(ctx context.Context, request *model.GenerateStoryRequest) (*model.GenerateStoryResult, error) {
	agentErrorResult := model.GenerateStoryResult{
		Code:    500,
		Message: "agent error",
	}
	basicErrorResult := model.GenerateStoryResult{
		Code:    500,
		Message: "server error",
	}
	client := deepseek.NewSSPClient()
	dsResponse, err := client.Communicate(ctx, &model.CommunicateRequest{
		Model:           model.DefaultDeepseekModel,
		Stream:          false,
		PresencePenalty: request.Creativity,
		Temperature:     request.Casualty,
		Messages: []model.ChatMessage{
			{
				Role: "system",
				Content: `你是一名游戏叙事设计师，负责生成符合世界观的剧情。  
            根据用户需求，可以生成：  
            - **背景故事**（历史事件、传说、过往冲突，使用过去时态）  
            - **当前剧情**（主线/支线任务、角色互动，使用现在时态）  
            要求：  
            1. 明确用户需求是「历史背景」还是「当前剧情」  
            2. 保持风格契合，避免违和设定  
            3. 输出控制在400-500字
			4. 提取关键人物，每人用1句话描述身份和动机 `,
			},
			{
				Role: "user",
				Content: fmt.Sprintf(
					"世界观设定：\n%s\n\n生成需求：%s\n\n请根据需求生成合适的剧情，并明确说明是「背景故事」还是「当前剧情」，人物单独列出",
					request.Background,
					request.Prompt,
				),
			},
		},
	})
	if err != nil {
		return &agentErrorResult, err
	}
	var result model.GenerateStoryResult
	result.Code = 200
	result.Message = "success"
	result.Response = &model.GenerateStoryResponse{
		Content: dsResponse.Choices[0].Message.Content,
	}
	// 增加用户统计次数
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return &basicErrorResult, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return &basicErrorResult, err
	}
	err = UpdateAccountStats(ctx, objID, "story_generation")
	if err != nil {
		return &basicErrorResult, err
	}
	return &result, nil
}
