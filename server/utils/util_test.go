package utils

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"testing"

	"github.com/joho/godotenv"
)

func Test_GetRootDir(t *testing.T) {
	fmt.Println(GetRootDir())
	rootDir := GetRootDir()
    envPath := filepath.Join(rootDir, ".env") // 拼接绝对路径
	fmt.Println(envPath)

    err := godotenv.Load(envPath)
    if err != nil {
        log.Fatal("Failed to load .env:", err)
    }

    secret := os.Getenv("liblib_secret_key")
    fmt.Println("liblib_secret_key", secret)
}