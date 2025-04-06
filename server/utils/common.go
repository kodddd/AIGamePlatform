package utils

import "encoding/json"

func JsonString(val interface{}) string {
	bytes, err := json.Marshal(val)
	if err != nil {
		panic(err) // unlikely to happen
	}
	return string(bytes)
}