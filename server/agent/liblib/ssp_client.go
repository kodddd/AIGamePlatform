package liblib

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
    
    c.setSignature()
    
    return c.request
}

func (c *SSPClient) TextToGraph(ctx context.Context,request *model.TextToGraphRequest)(*model.TextToGraphResponse,error){
    res:=&model.TextToGraphResponse{}
    _,err:=c.newRequest(ctx,"POST","/api/generate/webui/text2img/ultra",nil).Json(request).End(res)
    return res,err
}

func (c *SSPClient) GetGraphResult(ctx context.Context,request *model.GetGraphResultRequest)(*model.GetGraphResultResponse,error){
    res:=&model.GetGraphResultResponse{}
    _,err:=c.newRequest(ctx,"POST","/api/generate/webui/status",nil).Json(request).End(res)
    return res,err
}

