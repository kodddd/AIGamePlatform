package service

import (
	"AIGamePlatform/server/appctx"
	mongo "AIGamePlatform/server/db"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/utils"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongoErr "go.mongodb.org/mongo-driver/mongo"
)

const (
	AccountColletion = "account"
)

func GetMe(ctx context.Context) (*model.GetMeResult, error) {
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return nil, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	client := mongo.GetClient(ctx)
	var account model.Account
	client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
	return &model.GetMeResult{
		Code: 200, Message: "success", User: &account,
	}, nil
}

func duplicatedUsernameOrEmail(client *mongo.Client, userName string, email string, userID primitive.ObjectID) bool {
	var filter bson.M
	if userID == primitive.NilObjectID {
		fmt.Println("id:", userID)
		filter = bson.M{
			"$or": []bson.M{
				{"userName": userName},
				{"email": email},
			},
		}
	} else {
		fmt.Println("id:", userID)
		filter = bson.M{
			"$and": []bson.M{
				{
					"_id": bson.M{"$ne": userID}, // _id 不等于 userID
				},
				{
					"$or": []bson.M{ // 同时满足 $or 条件
						{"userName": userName},
						{"email": email},
					},
				},
			},
		}
	}
	count, _ := client.FindCount(AccountColletion, filter)
	if count != 0 {
		return true
	} else {
		return false
	}
}

func Login(ctx context.Context, request model.LoginRequest) (*model.LoginResult, error) {
	var key string
	var val string
	if request.Email == "" {
		key = "userName"
		val = request.UserName
	} else if request.UserName == "" {
		key = "email"
		val = request.Email
	}
	client := mongo.GetClient(ctx)
	var account model.Account
	err := client.FindOne(AccountColletion, bson.M{key: val}, &account)
	if err != nil {
		if err == mongoErr.ErrNoDocuments {
			return &model.LoginResult{Code: 403, Message: "wrong user name or email"}, nil
		}
		return &model.LoginResult{Code: 500, Message: "server error"}, err
	}
	if request.Password == account.Password {
		id, _ := client.FindOneAndGetID(AccountColletion, bson.M{key: val})
		token, err := utils.GenerateToken(ctx, id)
		if err != nil {
			return &model.LoginResult{Code: 500, Message: "server error"}, err
		}
		return &model.LoginResult{Code: 200, Message: "login success", User: &model.Account{
			UserName: account.UserName,
			Email:    account.Email,
		},
			Token: token}, nil
	} else {
		return &model.LoginResult{Code: 403, Message: "wrong password"}, nil
	}
}

func Register(ctx context.Context, request *model.RegisterRequest) (*model.RegisterResult, error) {
	client := mongo.GetClient(ctx)
	if duplicatedUsernameOrEmail(client, request.UserName, request.Email, primitive.NilObjectID) {
		return &model.RegisterResult{Code: 409, Message: "duplicated user name or email"}, nil
	}
	request.AccountStats = &model.AccountStats{
		ExpandStortyStat:    0,
		WorldStat:           0,
		GeneratePictureStat: 0,
	}
	result, _ := client.Insert(AccountColletion, *request)
	id := result.InsertedIDs[0].(string)
	token, err := utils.GenerateToken(ctx, id)
	if err != nil {
		return &model.RegisterResult{Code: 500, Message: "server error"}, err
	}
	return &model.RegisterResult{Code: 200, Message: "register success", User: &model.Account{
		UserName: request.UserName,
		Email:    request.Email,
	},
		Token: token}, nil
}

func UpdateProfile(ctx context.Context, request *model.UpdateProfileRequest) (*model.UpdateProfileResult, error) {
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return nil, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	client := mongo.GetClient(ctx)
	if duplicatedUsernameOrEmail(client, request.UserName, request.Email, objID) {
		return &model.UpdateProfileResult{Code: 409, Message: "duplicated user name or email"}, nil
	}
	var oldAccount model.Account
	client.FindOne(AccountColletion, bson.M{"_id": objID}, &oldAccount)
	newAccount := oldAccount
	newAccount.UserName = request.UserName
	newAccount.Email = request.Email
	client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, newAccount)
	return &model.UpdateProfileResult{Code: 200, Message: "update profile success", User: &model.Account{
		UserName: newAccount.UserName,
		Email:    newAccount.Email,
	}}, nil
}

func UpdatePassword(ctx context.Context, request *model.UpdatePasswordRequest) (*model.UpdatePasswordResult, error) {
	userID, err := appctx.GetUserID(ctx) // 从上下文获取userID
	if err != nil {
		return nil, err
	}
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	client := mongo.GetClient(ctx)
	var oldAccount model.Account
	client.FindOne(AccountColletion, bson.M{"_id": objID}, &oldAccount)
	if oldAccount.Password != request.CurrentPassword {
		return &model.UpdatePasswordResult{Code: 403, Message: "wrong password"}, nil
	}
	oldAccount.Password = request.NewPassword
	client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, oldAccount)
	return &model.UpdatePasswordResult{Code: 200, Message: "update password success"}, nil
}

func UpdateAccountStats(ctx context.Context, objID primitive.ObjectID, origin string) error {
	if origin == "" {
		return fmt.Errorf("origin is empty")
	} else if origin == "story_expansion" {
		client := mongo.GetClient(ctx)
		var account model.Account
		client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
		account.AccountStats.ExpandStortyStat++
		client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, account)
		return nil
	} else if origin == "world_creation" {
		client := mongo.GetClient(ctx)
		var account model.Account
		client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
		account.AccountStats.WorldStat++
		client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, account)
		return nil
	} else if origin == "picture_generation" {
		client := mongo.GetClient(ctx)
		var account model.Account
		client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
		account.AccountStats.GeneratePictureStat++
		client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, account)
		return nil
	} else if origin == "story_generation" {
		client := mongo.GetClient(ctx)
		var account model.Account
		client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
		account.AccountStats.GenerateStoryStat++
		client.ReplaceOne(AccountColletion, bson.M{"_id": objID}, account)
		return nil
	}
	return nil
}

func GetAccountStats(ctx context.Context) (*model.GetAccountStatsResult, error) {
	basicErrorResult := model.GetAccountStatsResult{
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
	client := mongo.GetClient(ctx)
	var account model.Account
	client.FindOne(AccountColletion, bson.M{"_id": objID}, &account)
	return &model.GetAccountStatsResult{
		Code: 200, Message: "success", AccountStats: account.AccountStats,
	}, nil
}
