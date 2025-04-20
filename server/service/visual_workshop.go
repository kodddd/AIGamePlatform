package service

import (
	"AIGamePlatform/server/agent/deepseek"
	"AIGamePlatform/server/agent/liblib"
	"AIGamePlatform/server/model"
	"context"
	"fmt"
	"time"
)

func GeneratePicture(ctx context.Context, request *model.GeneratePictureRequest) (*model.GeneratePictureResult, error) {
	result := model.GeneratePictureResult{}
	response := model.GeneratePictureResponse{}
	communicateRequest := model.CommunicateRequest{
		Model:  model.DefaultDeepseekModel,
		Stream: false,
		Messages: []model.ChatMessage{
			{
				Role:    "user",
				Content: "图画风格为" + request.Style + ",其余要求如下：\n" + request.Text,
			},
			{
				Role:    "system",
				Content: "你是一名专业的AI提示词工程师，请根据用户提供的文本来生成纯英文正向提示词文本。注意，请直接输出结果。",
			},
		},
		Temperature:     model.DefaultDeepseekTemperature,
		PresencePenalty: model.DefaultDeepseekPresencePenalty,
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
	result.Code = 200
	result.Message = "success"
	result.Response = &response
	return &result, nil
}
