package model

type (
	CreateWorldRequest struct {
		UserName    string   `json:"user_name" bson:"user_name"`
		BaseText    string   `json:"base_text" bson:"base_text"`
		WorldName   string   `json:"world_name" bson:"world_name"`
		Deleted     bool     `json:"deleted" bson:"deleted"`
		LastUpdated int64	`json:"last_updated" bson:"last_updated"`
	}
	CreateWorldResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
	World struct {
		Id string   `json:"id" bson:"_id"`
		UserName    string   `json:"user_name" bson:"user_name"`
		BaseText    string   `json:"base_text" bson:"base_text"`
		WorldName   string   `json:"world_name" bson:"world_name"`
		ImageRoutes []string `json:"image_routes" bson:"image_routes"`
		Deleted     bool     `json:"deleted" bson:"deleted"`
		LastUpdated int64	`json:"last_updated" bson:"last_updated"`
	}
	WorldListRequest struct {
		Page     int `json:"page"`
		PageSize int `json:"page_size"`
		UserName string `json:"user_name" bson:"user_name"`
	}
	WorldListResult struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		Worlds  []*World `json:"worlds"`
	}
	DeleteWorldRequest struct {
		Id string `json:"id" bson:"_id"`
	}
	DeleteWorldResult struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	}
)
