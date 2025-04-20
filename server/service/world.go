package service

import (
	mongo "AIGamePlatform/server/db"
	"AIGamePlatform/server/model"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	WorldCollection = "world"
)

func CreateWorld(ctx context.Context, request *model.CreateWorldRequest) (*model.CreateWorldResult, error) {
	request.Deleted = false
	client := mongo.GetClient(ctx)
	count, err := client.FindCount(WorldCollection, bson.M{"world_name": request.WorldName})
	if err != nil {
		return &model.CreateWorldResult{
			Code:    500,
			Message: "mongo error",
		}, err
	}
	if count > 0 {
		return &model.CreateWorldResult{
			Code:    400,
			Message: "world name already exists",
		}, nil
	}
	// 插入新世界
	client.InsertOne(WorldCollection, request)
	return &model.CreateWorldResult{
		Code:    200,
		Message: "success",
	}, nil
}

func WorldList(ctx context.Context, request *model.WorldListRequest) (*model.WorldListResult, error) {
	client := mongo.GetClient(ctx)
	var worlds []*model.World
	opts := options.Find().
		SetLimit(int64(request.PageSize)).
		SetSkip(int64((request.Page - 1) * request.PageSize))
	err := client.FindWithOptions(WorldCollection, bson.M{"deleted": false,"user_name":request.UserName}, opts, &worlds)
	if err != nil {
		return &model.WorldListResult{
			Code:    500,
			Message: "mongo error",
		}, err
	}
	return &model.WorldListResult{
		Code:    200,
		Message: "success",
		Worlds:  worlds,
	}, nil
}
