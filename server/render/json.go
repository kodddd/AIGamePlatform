package render

import (
	"AIGamePlatform/server/appctx"
	"context"
)

func JSON(ctx context.Context, code int, obj interface{}) {
	c := appctx.GinContext(ctx)
	c.JSON(code, obj)
}
