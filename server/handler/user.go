package handler

import (
	"encoding/json"
	"net/http"
	"my-fullstack-app/server/service" // 替换为你的模块路径
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	users := service.GetAllUsers()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUserByID(w http.ResponseWriter, r *http.Request) {
	// 从 URL 路径中获取用户 ID
	vars := mux.Vars(r)
	userID := vars["id"]

	// 调用 service 层获取用户信息
	user := service.GetUserByID(userID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	// 解析请求体
	var user service.User
	_ = json.NewDecoder(r.Body).Decode(&user)

	// 调用 service 层创建用户
	newUser := service.CreateUser(user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newUser)
}