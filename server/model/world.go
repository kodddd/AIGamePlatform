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
	Story struct {
		StoryName string `json:"story_name" bson:"story_name"`
		Text      string `json:"text" bson:"text"`
	}
	WorldStats struct {
		CharacterCount int `json:"character_count" bson:"character_count"`
		StoryCount     int `json:"story_count" bson:"story_count"`
	}
	World struct {
		Id          primitive.ObjectID `json:"id" bson:"_id"`
		UserID      string             `json:"user_id" bson:"user_id"`
		BaseText    string             `json:"base_text" bson:"base_text"`
		WorldName   string             `json:"world_name" bson:"world_name"`
		Characters  []*Character       `json:"characters" bson:"characters"`
		Storys      []*Story           `json:"storys" bson:"storys"`
		Deleted     bool               `json:"deleted" bson:"deleted"`
		LastUpdated int64              `json:"last_updated" bson:"last_updated"`
		WorldStats  *WorldStats        `json:"world_stats" bson:"world_stats"`
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
	AddStoryRequest struct {
		WorldID   string `json:"world_id" bson:"world_id"`
		StoryName string `json:"story_name" bson:"story_name"`
		Text      string `json:"text" bson:"text"`
	}
	AddStoryResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	GetWorldResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		World   *World `json:"world"`
	}
)
