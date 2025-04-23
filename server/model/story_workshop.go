package model

type (
	Story struct {
		Id      string `json:"id" bson:"_id"`
		WorldID string `json:"world_id" bson:"world_id"`
		Text    string `json:"text" bson:"text"`
	}
	GenerateStoryRequest struct {
		Background string  `json:"background"`
		Casualty   float64 `json:"casualty"`
		Creativity float64 `json:"creativity"`
		Prompt     string  `json:"prompt"`
	}
	GenerateStoryResult struct {
		Code     int                    `json:"code"`
		Message  string                 `json:"message"`
		Response *GenerateStoryResponse `json:"response"`
	}
	GenerateStoryResponse struct {
		Content string `json:"content"`
	}
)
