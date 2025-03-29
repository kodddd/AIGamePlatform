package handler

import (
	"AIGamePlatform/server/appctx"
	"AIGamePlatform/server/middleware"

	"github.com/gin-gonic/gin"
)

// LoadPublicRoutes 加载无需认证的公开路由
func LoadPublicRoutes(router gin.IRouter) {
	router.POST("/auth/login", appctx.GinHandler(Login))
	router.POST("/auth/register", appctx.GinHandler(Register))
	// router.GET("/health", appctx.GinHandler(HealthCheck)) // 示例公开接口
}

// LoadProtectedRoutes 加载需要JWT认证的受保护路由
func LoadProtectedRoutes(router gin.IRouter) {
	router.Use(middleware.JWTAuth())

	// 用户相关
	// router.GET("/profile", appctx.GinHandler(GetProfile))
	// router.PUT("/profile", appctx.GinHandler(UpdateProfile))

	// 其他受保护接口
	// router.POST("/posts", appctx.GinHandler(CreatePost))
}
