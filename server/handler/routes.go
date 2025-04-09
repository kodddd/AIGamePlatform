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
	router.GET("/auth/me", appctx.GinHandler(GetMe))
	router.POST("/user/profile/update", appctx.GinHandler(UpdateProfile))
	router.POST("/user/password/update", appctx.GinHandler(UpdatePassword))
	// router.PUT("/profile", appctx.GinHandler(UpdateProfile))

	// 功能相关
	router.POST("/function/story-expander", appctx.GinHandler(ExpandStory))
	router.POST("/function/generate-picture", appctx.GinHandler(GeneratePicture))
	// router.POST("/posts", appctx.GinHandler(CreatePost))
}
