package middleware

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/utils"
	"context"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从Header获取Token
		authHeader := c.GetHeader("Authorization")
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			_ = c.Error(appctx.NewUnauthorizedError("missing authorization token"))
			c.Abort()
			return
		}

		// 获取框架上下文
		ctx, err := appctx.GetContextFromGin(c)
		if err != nil {
			_ = c.Error(err)
			c.Abort()
			return
		}

		// 解析Token
		claims, err := utils.ParseToken(ctx, tokenString)
		if err != nil {
			_ = c.Error(appctx.NewUnauthorizedError("invalid token"))
			c.Abort()
			return
		}

		// 存储userID到上下文
		userID, ok := claims["user_id"].(string)
		if !ok {
			_ = c.Error(appctx.NewUnauthorizedError("token missing user_id"))
			c.Abort()
			return
		}

		// 存入gin和标准库context
		c.Set("userID", userID)
		newCtx := context.WithValue(ctx, "userID", userID)
		c.Set("ctxKey", newCtx) // 更新框架上下文

		c.Next()
	}
}