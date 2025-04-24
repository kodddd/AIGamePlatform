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

func AddCharacter(ctx context.Context, request *model.AddCharacterRequest) (*model.AddCharacterResult, error) {
	var world model.World
	basicErrorResponse := model.AddCharacterResult{
		Code:    500,
		Message: "server error",
	}
	client := mongo.GetClient(ctx)
	objID, err := primitive.ObjectIDFromHex(request.WorldID)
	if err != nil {
		return &basicErrorResponse, err
	}
	err = client.FindOne(WorldCollection, bson.M{"_id": objID}, &world)
	if err != nil {
		return &basicErrorResponse, err
	}
	// 检查角色名称是否重复
	if world.Characters != nil {
		for _, character := range world.Characters {
			if character.CharacterName == request.CharacterName {
				return &model.AddCharacterResult{
					Code:    400,
					Message: "character name already exists",
				}, nil
			}
		}
	}
	// 创建新角色
	newCharacter := &model.Character{
		CharacterName:        request.CharacterName,
		BaseImage:            request.BaseImage,
		CharacterDescription: request.CharacterDescription,
	}
	if world.Characters != nil {
		world.Characters = append(world.Characters, newCharacter)
	} else {
		world.Characters = []*model.Character{newCharacter}
	}
	world.LastUpdated = time.Now().Unix()
	// 更新world统计数据
	if world.WorldStats == nil {
		world.WorldStats = &model.WorldStats{} // 初始化
	}
	world.WorldStats.CharacterCount = len(world.Characters)
	// 更新世界文档
	_, err = client.ReplaceOne(WorldCollection, bson.M{"_id": world.Id}, world)
	if err != nil {
		return &basicErrorResponse, err
	}
	return &model.AddCharacterResult{
		Code:    200,
		Message: "success",
	}, nil
}

func AddStory(ctx context.Context, request *model.AddStoryRequest) (*model.AddStoryResult, error) {
	var world model.World
	basicErrorResponse := model.AddStoryResult{
		Code:    500,
		Message: "server error",
	}
	client := mongo.GetClient(ctx)
	objID, err := primitive.ObjectIDFromHex(request.WorldID)
	if err != nil {
		return &basicErrorResponse, err
	}
	err = client.FindOne(WorldCollection, bson.M{"_id": objID}, &world)
	if err != nil {
		return &basicErrorResponse, err
	}
	// 检查故事名称是否重复
	if world.Storys != nil {
		for _, story := range world.Storys {
			if story.StoryName == request.StoryName {
				return &model.AddStoryResult{
					Code:    400,
					Message: "story name already exists",
				}, nil
			}
		}
	}
	// 创建新故事
	newStory := &model.Story{
		StoryName: request.StoryName,
		Text:      request.Text,
	}
	if world.Storys != nil {
		world.Storys = append(world.Storys, newStory)
	} else {
		world.Storys = []*model.Story{newStory}
	}
	world.LastUpdated = time.Now().Unix()
	// 更新world统计数据
	if world.WorldStats == nil {
		world.WorldStats = &model.WorldStats{} // 初始化
	}
	world.WorldStats.StoryCount = len(world.Storys)
	// 更新世界文档
	_, err = client.ReplaceOne(WorldCollection, bson.M{"_id": world.Id}, world)
	if err != nil {
		return &basicErrorResponse, err
	}
	return &model.AddStoryResult{
		Code:    200,
		Message: "success",
	}, nil
}

func GetWorld(ctx context.Context, worldID string) (*model.GetWorldResult, error) {
	client := mongo.GetClient(ctx)
	var world model.World
	basicErrorResult := model.GetWorldResult{
		Code:    500,
		Message: "server error",
	}
	objID, err := primitive.ObjectIDFromHex(worldID)
	if err != nil {
		return &basicErrorResult, err
	}
	err = client.FindOne(WorldCollection, bson.M{"_id": objID}, &world)
	if err != nil {
		return &basicErrorResult, err
	}
	return &model.GetWorldResult{
		Code:    200,
		Message: "success",
		World:   &world,
	}, nil
}
