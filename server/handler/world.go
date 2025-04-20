package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
	"fmt"
)

func CreateWorld(ctx context.Context) error {
	fmt.Println("in")
	var request model.CreateWorldRequest
	if err := appctx.BindJSON(ctx, &request); err != nil {
		return err
	}
	result, err := service.CreateWorld(ctx, &request)
	if err != nil {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, "success")
	}
	fmt.Println("hi")
	return nil
}

func WorldList(ctx context.Context) error {
	var request model.WorldListRequest
	if err := appctx.BindJSON(ctx, &request); err != nil {
		return err
	}
	result, err := service.WorldList(ctx, &request)
	if err != nil {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, result.Worlds)
	}
	return nil
}
