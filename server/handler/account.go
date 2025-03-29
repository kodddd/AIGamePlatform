package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
	"log"
)

func Register(ctx context.Context) error {
	var request model.RegisterRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	result, err := service.Register(ctx, &request)
	if err != nil {
		return err
	}
	if result.Code == 200 {
		render.JSON(ctx, result.Code, model.RegisterResponse{
			Token:    result.Token,
			UserName: result.User.UserName,
			Email:    result.User.Email,
		})
	} else {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	}

	return nil
}

func Login(ctx context.Context) error {
	var request model.LoginRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	log.Println(request)
	result, err := service.Login(ctx, request)
	if err != nil {
		return err
	}
	if result.Code == 200 {
		render.JSON(ctx, result.Code, model.LoginResponse{
			Token:    result.Token,
			UserName: result.User.UserName,
			Email:    result.User.Email,
		})
	} else {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Code:    result.Code,
			Message: result.Message,
		})
	}
	return nil
}
