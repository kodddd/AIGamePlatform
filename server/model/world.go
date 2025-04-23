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
	Character struct {
		ImageRoutes          []string `json:"image_routes" bson:"image_routes"`
		BaseImage            string   `json:"base_image" bson:"base_image"`
		CharacterName        string   `json:"character_name" bson:"character_name"`
		CharacterDescription string   `json:"character_description" bson:"character_description"`
	}
	World struct {
		Id          primitive.ObjectID `json:"id" bson:"_id"`
		UserID      string             `json:"user_id" bson:"user_id"`
		BaseText    string             `json:"base_text" bson:"base_text"`
		WorldName   string             `json:"world_name" bson:"world_name"`
		Characters  []*Character       `json:"characters" bson:"characters"`
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
	AddCharacterRequest struct {
		WorldID              string `json:"world_id" bson:"world_id"`
		CharacterName        string `json:"character_name" bson:"character_name"`
		BaseImage            string `json:"base_image" bson:"base_image"`
		CharacterDescription string `json:"character_description" bson:"character_description"`
	}
	AddCharacterResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
)
