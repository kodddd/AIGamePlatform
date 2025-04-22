package service

import (
	"AIGamePlatform/server/appctx"
	mongo "AIGamePlatform/server/db"
	"AIGamePlatform/server/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	WorldCollection = "world"
)

func CreateWorld(ctx context.Context, request *model.CreateWorldRequest) (*model.CreateWorldResult, error) {
	request.Deleted = false
	request.LastUpdated = time.Now().Unix()
	basicErrorResult := model.CreateWorldResult{
		Code:    500,
		Message: "server error",
	}
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return &basicErrorResult, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return &basicErrorResult, err
	}
	request.UserID = userID
	client := mongo.GetClient(ctx)
	count, err := client.FindCount(WorldCollection, bson.M{"world_name": request.WorldName, "user_id": userID, "deleted": false})
	if err != nil {
		return &basicErrorResult, err
	}
	if count > 0 {
		return &model.CreateWorldResult{
			Code:    400,
			Message: "world name already exists",
		}, nil
	}
	// 插入新世界
	client.InsertOne(WorldCollection, request)
	// 添加用户统计数据
	err = UpdateAccountStats(ctx, objID, "world_creation")
	if err != nil {
		return &basicErrorResult, err
	}
	return &model.CreateWorldResult{
		Code:    200,
		Message: "success",
	}, nil
}

func WorldList(ctx context.Context, request *model.WorldListRequest) (*model.WorldListResult, error) {
	client := mongo.GetClient(ctx)
	var worlds []*model.World
	basicErrorResult := model.WorldListResult{
		Code:    500,
		Message: "server error",
	}
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return &basicErrorResult, err
	}
	opts := options.Find().
		SetLimit(int64(request.PageSize)).
		SetSkip(int64((request.Page - 1) * request.PageSize))
	count, err := client.FindCount(WorldCollection, bson.M{"deleted": false, "user_id": userID})
	if err != nil {
		return &basicErrorResult, err
	}
	err = client.FindWithOptions(WorldCollection, bson.M{"deleted": false, "user_id": userID}, opts, &worlds)
	if err != nil {
		return &basicErrorResult, err
	}
	return &model.WorldListResult{
		Code:       200,
		Message:    "success",
		Worlds:     worlds,
		TotalCount: count,
	}, nil
}

func DeleteWorld(ctx context.Context, request *model.DeleteWorldRequest) (*model.DeleteWorldResult, error) {
	objectID, err := primitive.ObjectIDFromHex(request.Id)
	if err != nil {
		return &model.DeleteWorldResult{
			Code:    400,
			Message: "invalid id",
		}, err
	}
	client := mongo.GetClient(ctx)
	_, err = client.UpdateOne(WorldCollection, bson.M{"_id": objectID}, bson.M{"$set": bson.M{"deleted": true}})
	if err != nil {
		return &model.DeleteWorldResult{
			Code:    500,
			Message: "mongo error",
		}, err
	}
	return &model.DeleteWorldResult{
		Code:    200,
		Message: "success",
	}, nil
}
