package service

import (
	mongo "AIGamePlatform/server/db"
	"AIGamePlatform/server/model"
	"context"
	"fmt"
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
	client := mongo.GetClient(ctx)
	count, err := client.FindCount(WorldCollection, bson.M{"world_name": request.WorldName,"user_name":request.UserName})
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

func DeleteWorld(ctx context.Context,request *model.DeleteWorldRequest)(*model.DeleteWorldResult,error){
	fmt.Println(request.Id)
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
