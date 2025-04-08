package utils

import (
	"path/filepath"
	"runtime"
)

func GetRootDir() string {
	_, currentFile, _, _ := runtime.Caller(0)      // 当前文件的路径
	return filepath.Dir(filepath.Dir(currentFile)) // 返回根目录（假设 utils 在 server/utils 下）
}

func GetEnvPath() string {
	rootDir := GetRootDir()
	envPath := filepath.Join(rootDir, ".env") // 拼接绝对路径
	return envPath
}
