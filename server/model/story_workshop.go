package model

type (
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
