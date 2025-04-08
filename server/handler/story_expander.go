package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
)

func ExpandStory(ctx context.Context) error {
	var request model.ExpandStoryRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	result, err := service.ExpandStory(ctx, &request)
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, *result.Response)
	}
	return err
}
