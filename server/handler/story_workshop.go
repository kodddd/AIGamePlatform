package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
)

func GenerateStory(ctx context.Context) error {
	var request model.GenerateStoryRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	result, err := service.GenerateStory(ctx, &request)
	if err != nil {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
		return err
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, result.Response)
	}
	return nil
}
