package deepseek

import (
	"AIGamePlatform/server/agent"
	"AIGamePlatform/server/utils"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type (
	ClientCore struct {
		apiUrl  string
		apiKey  string
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
		apiKey: os.Getenv("deepseek_api_key"),
		apiUrl: os.Getenv("deepseek_api_url"),
	}
}

func (c *SSPClient) setToken() {
	if c.request == nil {
		return
	}
	c.request.Token("Bearer " + c.apiKey)
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
