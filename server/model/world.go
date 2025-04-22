package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type (
	CreateWorldRequest struct {
		UserID      string `json:"user_id" bson:"user_id"`
		BaseText    string `json:"base_text" bson:"base_text"`
		WorldName   string `json:"world_name" bson:"world_name"`
		Deleted     bool   `json:"deleted" bson:"deleted"`
		LastUpdated int64  `json:"last_updated" bson:"last_updated"`
	}
	CreateWorldResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	World struct {
		Id          primitive.ObjectID `json:"id" bson:"_id"`
		UserID      string             `json:"user_id" bson:"user_id"`
		BaseText    string             `json:"base_text" bson:"base_text"`
		WorldName   string             `json:"world_name" bson:"world_name"`
		ImageRoutes []string           `json:"image_routes" bson:"image_routes"`
		Deleted     bool               `json:"deleted" bson:"deleted"`
		LastUpdated int64              `json:"last_updated" bson:"last_updated"`
	}
	WorldListRequest struct {
		Page     int `json:"page"`
		PageSize int `json:"page_size"`
	}
	WorldListResult struct {
		Code       int      `json:"code"`
		Message    string   `json:"message"`
		Worlds     []*World `json:"worlds"`
		TotalCount int      `json:"total_count"`
	}
	DeleteWorldRequest struct {
		Id string `json:"id" bson:"_id"`
	}
	DeleteWorldResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
)
