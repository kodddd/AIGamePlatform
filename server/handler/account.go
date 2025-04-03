package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"context"
	"log"
)

func GetMe(ctx context.Context) error {
	result,err:=service.GetMe(ctx)
	if err!=nil{
		return err
	}
	render.JSON(ctx,result.Code,&model.GetMeResponse{
		UserName: result.User.UserName,
		Email: result.User.Email,
	})
	return nil
}

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

func UpdateProfile(ctx context.Context)error{
	var request model.UpdateProfileRequest
	err:=appctx.BindJSON(ctx,&request)
	if err!=nil{
		return err
	}
	result,err:=service.UpdateProfile(ctx,&request)
	if err!=nil{
		return err
	}
	if result.Code==200{
		render.JSON(ctx,result.Code,model.UpdateProfileResponse{
			UserName: result.User.UserName,
			Email: result.User.Email,
		})
	}else{
		render.JSON(ctx,result.Code,model.BasicErrorData{
			Code: result.Code,
			Message: result.Message,
		})
	}
	return nil
}

func UpdatePassword(ctx context.Context)error{
	var request model.UpdatePasswordRequest
	err:=appctx.BindJSON(ctx,&request)
	if err!=nil{
		return err
	}
	result,err:=service.UpdatePassword(ctx,&request)
	if err!=nil{
		return err
	}
	if result.Code==200{
		render.JSON(ctx,result.Code,model.BasicResponse{
			Code: result.Code,
			Message: result.Message,
		})
	}else{
		render.JSON(ctx,result.Code,model.BasicErrorData{
			Code: result.Code,
			Message: result.Message,
		})
	}
	return nil
}