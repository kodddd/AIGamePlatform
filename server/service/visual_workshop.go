package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/agent/liblib"
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GeneratePicture(ctx context.Context, request *model.GeneratePictureRequest) (*model.GeneratePictureResult, error) {
	result := model.GeneratePictureResult{}
	response := model.GeneratePictureResponse{}
	basicErrorResult := model.GeneratePictureResult{
		Code:    500,
		Message: "server error",
	}
	communicateRequest := model.CommunicateRequest{
		Model:  model.DefaultDeepseekModel,
		Stream: false,
		Messages: []model.ChatMessage{
			{
				Role:    "system",
				Content: "你是一名专业的游戏原画提示词工程师，专门将中文描述转换为AI绘图用的英文提示词。请根据用户提供的画风、世界观和角色描述，生成结构清晰、细节丰富的纯英文正向提示词。只需输出最终的英文提示词，不要包含任何解释或额外说明。",
			},
			{
				Role: "user",
				Content: fmt.Sprintf("画风要求：%s\n世界观背景：%s\n角色描述：%s\n\n请将以上信息转化为适合AI生成游戏角色原画的英文提示词，需符合以下要求：\n1. 纯英文输出\n2. 包含角色特征、服饰细节、神态等关键要素\n3. 保持与指定画风和世界观的一致性\n4. 使用逗号分隔的短语形式，不要用完整句子",
					request.Style,
					request.Background,
					request.Text),
			},
		},
		Temperature:     0.3,
		PresencePenalty: 0.5,
	}
	dsclient := deepseek.NewSSPClient()
	communicateResponse, err := dsclient.Communicate(ctx, &communicateRequest)
	if err != nil {
		return &model.GeneratePictureResult{
			Code:    500,
			Message: "deepseek agent error",
		}, err
	}
	prompt := communicateResponse.Choices[0].Message.Content
	fmt.Println("prompt:", prompt)
	// 调用图片生成API
	liblibRequest := &model.TextToGraphRequest{
		GenerateParams: &model.GenerateParams{
			Prompt:      prompt,
			AspectRatio: request.AspectRatio,
			ImgCount:    1,
			Steps:       30,
		},
		TemplateUuid: model.TemplateUuid,
	}
	libClient := liblib.NewSSPClient()
	libResponse, err := libClient.TextToGraph(ctx, liblibRequest)
	if err != nil {
		return &model.GeneratePictureResult{
			Code:    500,
			Message: "liblib agent error",
		}, err
	}
	generateUuid := libResponse.Data.GenerateUuid
	// 获取图片生成结果
	fmt.Println("generateUuid:", generateUuid)
	getGraphRequest := &model.GetGraphResultRequest{
		GenerateUuid: generateUuid,
	}
	// 轮询获取生成结果
	for {
		time.Sleep(5 * time.Second)
		getGraphResponse, err := libClient.GetGraphResult(ctx, getGraphRequest)
		if err != nil {
			return &model.GeneratePictureResult{
				Code:    500,
				Message: "liblib agent error",
			}, err
		}
		if getGraphResponse.Data.GenerateStatus == model.LibGenerateSuccess {
			response.Url = getGraphResponse.Data.Images[0].ImageUrl
			break
		} else if getGraphResponse.Data.GenerateStatus == model.LibGenerateFail {
			result.Code = 500
			result.Message = "Generating picture fail"
			break
		} else if getGraphResponse.Data.GenerateStatus == model.LibGenerateOverTime {
			result.Code = 500
			result.Message = "Generating picture over time"
			break
		}
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
	err = UpdateAccountStats(ctx, objID, "picture_generation")
	if err != nil {
		return &basicErrorResult, err
	}
	result.Code = 200
	result.Message = "success"
	result.Response = &response
	return &result, nil
}
