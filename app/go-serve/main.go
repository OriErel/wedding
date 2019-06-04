// This small program is just a small web server created in static mode
// in order to provide the smallest docker image possible


package main

import (
	"os"
	"os/signal"
	"syscall"
	"fmt"
	"log"
	"bytes"
	cors "github.com/AdhityaRamadhanus/fasthttpcors"
	"github.com/valyala/fasthttp"
)

var	FilesHandler = fasthttp.CompressHandler(fasthttp.FSHandler("/srv/http", 0))

func HealthHandler(ctx *fasthttp.RequestCtx) {
	fmt.Fprint(ctx, "Ok\n")
}

func RequestHandler(ctx *fasthttp.RequestCtx) {
	path := ctx.Path()
	log.Printf("%s %s (%s)", ctx.Method, path, ctx.Request.Header.UserAgent())
	switch {
	case bytes.HasPrefix(path, []byte("/health")):
		HealthHandler(ctx)
	case bytes.Index(path, []byte("bootstrap.js")) != -1:
		ctx.Response.Header.Set("cache-control", "no-cache, no-store, must-revalidate")
		FilesHandler(ctx)
	default:
		ctx.Response.Header.Set("cache-control", "public, max-age=2592000")
		FilesHandler(ctx)
	}
}

func main() {
    agent := Agent{}

	port := fmt.Sprintf(":%s", agent.getEnv("PORT", "3000"))

	var gracefulStop = make(chan os.Signal)
	signal.Notify(gracefulStop, os.Interrupt)
	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)
	go func() { 
		<-gracefulStop
		os.Exit(0)
	}()

	withCors := cors.NewCorsHandler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"DNT","User-Agent","X-Requested-With","If-Modified-Since","Cache-Control","Content-Type","Range"},
		AllowedMethods:   []string{"GET", "OPTIONS"},
		AllowCredentials: false,
		AllowMaxAge:      5600,
		Debug:            true,
	})

	log.Printf("Listening at 0.0.0.0%v", port)
	log.Fatal(fasthttp.ListenAndServe(port, withCors.CorsMiddleware(RequestHandler)))
}