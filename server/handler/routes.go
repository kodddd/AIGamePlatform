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
	router.GET("/user/stats", appctx.GinHandler(GetAccountStats))
	router.POST("/user/password/update", appctx.GinHandler(UpdatePassword))
	// router.PUT("/profile", appctx.GinHandler(UpdateProfile))

	// 功能相关
	router.POST("/function/story-expander", appctx.GinHandler(ExpandStory))
	router.POST("/function/generate-picture", appctx.GinHandler(GeneratePicture))
	router.POST("/world/create", appctx.GinHandler(CreateWorld))
	router.POST("/world/list", appctx.GinHandler(WorldList))
	router.GET("/world/delete", appctx.GinHandler(DeleteWorld))
	router.POST("/world/add-character", appctx.GinHandler(AddCharacter))
	router.POST("/world/add-story", appctx.GinHandler(AddStory))
	router.POST("/function/story-generation", appctx.GinHandler(GenerateStory))
	// router.POST("/posts", appctx.GinHandler(CreatePost))
}
