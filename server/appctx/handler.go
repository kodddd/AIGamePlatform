package appctx

import (
	"context"

	"github.com/gin-gonic/gin"
)

type HandlerFunc func(context.Context) error

func GinHandler(handler HandlerFunc) gin.HandlerFunc{
	return func(c *gin.Context){
		ctx,err:=GetContextFromGin(c)
		if err!=nil{
			c.Error(err)
		}
		err = handler(ctx)
		if err!=nil{
			c.Error(err)
		}
	}
}