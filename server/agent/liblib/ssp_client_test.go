package liblib

import (
	"AIGamePlatform/server/model"
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_TextToGraph(t *testing.T){
    request:=&model.TextToGraphRequest{
        TemplateUuid: model.TemplateUuid,
        GenerateParams: &model.GenerateParams{
            Prompt: "1 girl,lotus leaf,masterpiece,best quality,finely detail,highres,beautiful and aesthetic,no watermark,",
            AspectRatio: "portrait",
            ImageSize: &model.ImageSize{
                Width:  512,
                Height: 512,
            },
            ImgCount: 1,
            Steps:   30,
        },
    }
    c:= NewSSPClient()
    res,err:=c.TextToGraph(context.Background(),request)
    assert.Nil(t, err)
    OutputTestLog(t.Name(), res)
}

func Test_GetGrapth(t *testing.T){
    request:=&model.GetGraphResultRequest{
        GenerateUuid: "f807342d33d5498c8880aa855b104fa6",
    }
    c:= NewSSPClient()
    res,err:=c.GetGraphResult(context.Background(),request)
    assert.Nil(t, err)
    OutputTestLog(t.Name(), res)
}