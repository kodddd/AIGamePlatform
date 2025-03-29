package appctx

import (
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
)
type contextKey string

const(
	 keyGinContext contextKey ="gin_context"
)

func GetContextFromGin(c *gin.Context) (context.Context,error){
	val, exists := c.Get("ctxKey")
	if !exists {
		return nil, fmt.Errorf("context not set in gin")
	}
	
	ctx, ok := val.(context.Context)
	if !ok {
		return nil, fmt.Errorf("invalid context type")
	}
	return ctx, nil
}

func GinContext(ctx context.Context) *gin.Context{
	val:=ctx.Value(keyGinContext)
	if val==nil {
		return nil
	}
	return val.(*gin.Context)
}

func GetUserID(ctx context.Context) (string, error) {
	val := ctx.Value("userID")
	if val == nil {
		return "", fmt.Errorf("userID not found in context")
	}
	userID, ok := val.(string)
	if !ok {
		return "", fmt.Errorf("invalid userID type")
	}
	return userID, nil
}

func NewUnauthorizedError(msg string) error {
	return &unauthorizedError{msg: msg}
}

type unauthorizedError struct {
	msg string
}

func (e *unauthorizedError) Error() string {
	return e.msg
}