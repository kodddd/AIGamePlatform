package liblib

import (
	"AIGamePlatform/server/agent"
	"AIGamePlatform/server/utils"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"log"
	"math/rand"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type (
	ClientCore struct {
		access  string
		secret  string
		apiUrl  string
		request *agent.Request
	}

	SSPClient struct {
		ClientCore
	}
)

func NewClientCore() ClientCore {
	envPath := utils.GetEnvPath()
	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatal("Failed to load .env:", err)
	}
	return ClientCore{
		secret: os.Getenv("liblib_secret_key"),
		access: os.Getenv("liblib_access_key"),
		apiUrl: os.Getenv("liblib_api_url"),
	}
}

// 生成随机字符串
func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

// setToken 设置API请求所需的认证参数
func (c *SSPClient) setSignature() {
	if c.request == nil {
		return
	}

	// 1. 生成必要参数
	timestamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
	nonce := randomString(10)

	// 2. 构建待签名字符串（格式：URI&Timestamp&SignatureNonce）
	// 获取请求的URI路径（不含查询参数）
	requestUrl := c.request.GetUrl() // 假设agent.Request有URL()方法获取完整URL
	fmt.Println("requestUrl", requestUrl)
	uriPath := "/"
	if u, err := url.Parse(requestUrl); err == nil {
		uriPath = u.Path
	}
	fmt.Println("uriPath", uriPath)
	content := uriPath + "&" + timestamp + "&" + nonce

	// 3. 计算HMAC-SHA1签名
	mac := hmac.New(sha1.New, []byte(c.secret))
	mac.Write([]byte(content))
	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))

	// 4. 添加认证参数到查询字符串
	c.request.
		QueryParam("AccessKey", c.access).
		QueryParam("Signature", signature).
		QueryParam("Timestamp", timestamp).
		QueryParam("SignatureNonce", nonce)
}

func OutputTestLog(funcName string, resp interface{}) {
	println(fmt.Sprintf("----------[%s]----------\n", funcName))
	println(utils.JsonString(resp))
	line := "--"
	for i := 0; i < len(funcName); i++ {
		line += "-"
	}
	println(fmt.Sprintf("\n----------%s----------\n", line))
}
