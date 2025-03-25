package handler

import (
	"net/http"
	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// 用户相关路由
	r.HandleFunc("/users", GetUsers).Methods("GET")
	r.HandleFunc("/users/{id}", GetUserByID).Methods("GET")
	r.HandleFunc("/users", CreateUser).Methods("POST")

	// 认证相关路由
	r.HandleFunc("/login", Login).Methods("POST")
	r.HandleFunc("/logout", Logout).Methods("POST")

	return r
}