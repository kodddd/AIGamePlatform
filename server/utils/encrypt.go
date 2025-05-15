package utils

import (
	"golang.org/x/crypto/bcrypt"
)

// HashPassword 对用户密码进行加密
// password 是用户输入的明文密码
// 返回加密后的哈希密码和可能的错误
func HashPassword(password string) (string, error) {
	// bcrypt.DefaultCost 是默认的计算成本(10)，可以根据服务器性能调整(4-31)
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// CheckPassword 验证密码是否匹配
// hashedPassword 是数据库存储的加密密码
// password 是用户输入的明文密码
// 返回nil表示匹配，否则不匹配
func CheckPassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
