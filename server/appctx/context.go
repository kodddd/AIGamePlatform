package appctx

import (
	"context"

	"github.com/gin-gonic/gin"
)

const(
	 keyGinContext string ="gin_context"
)

func GetContextFromGin(c *gin.Context) context.Context {
	val,_:=c.Get("ServiceContext")
	return val.(context.Context)
}

func GinContext(ctx context.Context) *gin.Context{
	val:=ctx.Value(keyGinContext)
	if val==nil {
		return nil
	}
	return val.(*gin.Context)
}