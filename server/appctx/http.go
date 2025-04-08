package appctx

import (
	"context"
)

func Query(ctx context.Context, key string) (va string) {
	c := GinContext(ctx)
	return c.Query(key)
}

func BindJSON(ctx context.Context, obj interface{}) error {
	c := GinContext(ctx)
	err := c.BindJSON(obj)
	if err != nil {
		return err
	}
	return nil
}
