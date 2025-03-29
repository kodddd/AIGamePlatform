package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Id string
type Ids []Id

func NewId() Id {
	return Id(primitive.NewObjectID().Hex())
}

type (
	BasicResult struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
	}

	BasicErrorData struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
	}
)
