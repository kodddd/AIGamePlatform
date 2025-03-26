package handler

import (
	"AIGamePlatform/server/appctx"

	"github.com/gin-gonic/gin"
)

func LoadAPIRoutes(router gin.IRouter){
	router.POST("/login",appctx.GinHandler(login))
}