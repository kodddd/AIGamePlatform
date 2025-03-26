package main

import (
	"AIGamePlatform/server/handler"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化 Gin 引擎
	r := gin.Default()

	// 加载 API 路由
	handler.LoadAPIRoutes(r)

	// 启动服务器
	port := ":8080" // 默认端口
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}