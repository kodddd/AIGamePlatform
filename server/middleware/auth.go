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
		// 1. 从Header获取Token
		authHeader := c.GetHeader("Authorization")
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			_ = c.Error(appctx.NewUnauthorizedError("missing authorization token"))
			c.Abort()
			return
		}

		// 2. 初始化上下文
		ctx := c.Request.Context()
		if ctx == nil {
			ctx = context.Background()
		}

		// 3. 存储gin.Context到标准上下文
		ctx = context.WithValue(ctx, appctx.KeyGinContext, c)
		c.Request = c.Request.WithContext(ctx)

		// 4. 解析Token
		claims, err := utils.ParseToken(ctx, tokenString)
		if err != nil {
			_ = c.Error(appctx.NewUnauthorizedError("invalid token: " + err.Error()))
			c.Abort()
			return
		}

		// 5. 获取并验证userID
		userID, ok := claims["user_id"].(string)
		if !ok || userID == "" {
			_ = c.Error(appctx.NewUnauthorizedError("token missing valid user_id"))
			c.Abort()
			return
		}
		// 6. 存储userID到上下文

		// 存入标准context.Context
		ctx = context.WithValue(ctx, appctx.KeyUserID, userID)
		c.Request = c.Request.WithContext(ctx)
		c.Set("ctxKey", ctx)
		c.Next()
	}
}
