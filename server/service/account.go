package service

import (
	mongo "AIGamePlatform/server/db"
	"AIGamePlatform/server/model"
	"AIGamePlatform/server/utils"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	mongoErr "go.mongodb.org/mongo-driver/mongo"
)

const (
	AccountColletion = "account"
)

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
		id,_:=client.FindOneAndGetID(AccountColletion, bson.M{key: val})
		token, err := utils.GenerateToken(ctx,id)
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
	count, err := client.FindCount(AccountColletion, bson.M{
		"$or": []bson.M{
			{"userName": request.UserName},
			{"email": request.Email},
		},
	})
	if err != nil {
		return &model.RegisterResult{Code: 500, Message: "error in mongo"}, err
	}
	if count != 0 {
		return &model.RegisterResult{Code: 409, Message: "duplicated userName or email"}, nil
	}
	client.Insert(AccountColletion, model.Account(*request))
	return &model.RegisterResult{Code: 200, Message: "register success", User: &model.Account{
		UserName: request.UserName,
		Email:    request.Email,
	},
		Token: "testToken"}, nil
}
