package model

type (
	ExpandStoryRequest struct {
		Creativity float64 `json:"creativity" bson:"creativity"`
		Casualty   float64 `json:"casualty" bson:"casualty"`
		Genre      string  `json:"genre" bson:"genre"`
		Text       string  `json:"text" bson:"text"`
	}
	ExpandStoryResult struct {
		Code     int                  `json:"code"`
		Message  string               `json:"message"`
		Response *ExpandStoryResponse `json:"response"`
	}
	ExpandStoryResponse struct {
		Content string `json:"content"`
	}
)
