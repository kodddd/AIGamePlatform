package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Id string
type Ids []Id

func NewId() Id {
	return Id(primitive.NewObjectID().Hex())
}