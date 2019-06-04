
package main

import (
	"os"
)

type Agent struct {
}

func (ag Agent) getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}