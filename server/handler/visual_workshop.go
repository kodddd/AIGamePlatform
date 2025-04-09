package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
)

func GeneratePicture(ctx context.Context) error {
	// 处理生成图片的请求
	var request model.GeneratePictureRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	result, err := service.GeneratePicture(ctx, &request)
	if err != nil {
		render.JSON(ctx, 500, model.BasicErrorData{
			Message: "agent error",
			Code:    500,
		})
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, *result.Response)
	}
	return nil
}
