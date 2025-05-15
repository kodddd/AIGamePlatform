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
		return err
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
		return err
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, model.BasicErrorData{
			Message: result.Message,
			Code:    result.Code,
		})
	} else {
		render.JSON(ctx, result.Code, result)
	}
	return nil
}

func DeleteWorld(ctx context.Context) error {
	var request model.DeleteWorldRequest
	id := appctx.Query(ctx, "id")
	request.Id = id
	result, err := service.DeleteWorld(ctx, &request)
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
		render.JSON(ctx, result.Code, "success")
	}
	return nil
}

func AddCharacter(ctx context.Context) error {
	var request model.AddCharacterRequest
	if err := appctx.BindJSON(ctx, &request); err != nil {
		return err
	}
	result, err := service.AddCharacter(ctx, &request)
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
		render.JSON(ctx, result.Code, result.Message)
	}
	return nil
}

func AddStory(ctx context.Context) error {
	var request model.AddStoryRequest
	if err := appctx.BindJSON(ctx, &request); err != nil {
		return err
	}
	result, err := service.AddStory(ctx, &request)
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
		render.JSON(ctx, result.Code, result.Message)
	}
	return nil
}

func GetWorld(ctx context.Context) error {
	worldID := appctx.Query(ctx, "world_id")
	result, err := service.GetWorld(ctx, worldID)
	if err != nil {
		render.JSON(ctx, result.Code, result.Message)
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, result.Message)
	} else {
		render.JSON(ctx, result.Code, result.World)
	}
	return nil
}

func GetWorldCharacters(ctx context.Context) error {
	worldID := appctx.Query(ctx, "world_id")
	result, err := service.GetWorldCharacters(ctx, worldID)
	if err != nil {
		render.JSON(ctx, result.Code, result.Message)
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, result.Message)
	} else {
		render.JSON(ctx, result.Code, result.Characters)
	}
	return nil
}
func GetWorldStories(ctx context.Context) error {
	worldID := appctx.Query(ctx, "world_id")
	result, err := service.GetWorldStories(ctx, worldID)
	if err != nil {
		render.JSON(ctx, result.Code, result.Message)
	}
	if result.Code != 200 {
		render.JSON(ctx, result.Code, result.Message)
	} else {
		render.JSON(ctx, result.Code, result.Storys)
	}
	return nil
}
