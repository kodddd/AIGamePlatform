package deepseek

import (
	"AIGamePlatform/server/agent"
	"AIGamePlatform/server/model"
	"context"
	"fmt"
)

func NewSSPClient() *SSPClient {
	return &SSPClient{
		ClientCore: NewClientCore(),
	}
}

func (c *SSPClient) newRequest(ctx context.Context, method string, path string, params *map[string]string) *agent.Request {
	c.request = agent.NewRequest(ctx, method)
	if params != nil {
		for key, value := range *params {
			c.request.QueryParam(key, value)
		}
	}
	c.request.Url(fmt.Sprintf("%s%s", c.apiUrl, path))

	c.setToken()
	return c.request
}

func (c *SSPClient) Communicate(ctx context.Context, request *model.CommunicateRequest) (*model.CommunicateResponse, error) {
	res := &model.CommunicateResponse{}
	_, err := c.newRequest(ctx, "POST", "/chat/completions", nil).Json(request).End(res)
	return res, err
}
