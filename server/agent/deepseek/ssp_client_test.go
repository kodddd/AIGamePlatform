package deepseek

import (
	"AIGamePlatform/server/model"
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_Communicate(t *testing.T) {
	req := &model.CommunicateRequest{
		Model: "deepseek-chat",
		Messages: []model.ChatMessage{
			{
				Role:    "user",
				Content: "这是一个魔法的世界，有着各种各样的魔法生物和神秘的力量。人们生活在一个被魔法笼罩的世界中，拥有不同的魔法能力和职业。这个世界有着丰富的历史和文化，充满了冒险和探索的机会。",
			},
			{
				Role:    "system",
				Content: "我是一个游戏世界观开发助手，会根据提供的信息来扩写世界观。",
			},
		},
	}
	c := NewSSPClient()
	res, err := c.Communicate(context.Background(), req)
	assert.Nil(t, err)
	OutputTestLog(t.Name(), res)
}
