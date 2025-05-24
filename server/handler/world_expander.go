package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/render"
	"AIGamePlatform/server/service"
	"AIGamePlatform/server/utils"
	"context"
)

func ExpandStory(ctx context.Context) error {
	var request model.ExpandStoryRequest
	err := appctx.BindJSON(ctx, &request)
	if err != nil {
		return err
	}
	taskID:=utils.GenerateTaskID()
	go service.ExpandStory(ctx, &request,taskID)
	err=utils.SaveTaskStatus(ctx,taskID,"pending","")
	if err!=nil{
		return err
	}
	render.JSON(ctx,200,model.AsyncResponse{
		TaskId: taskID,
		Message: "accepted",
		Code: 202,
	})
	return nil
}
