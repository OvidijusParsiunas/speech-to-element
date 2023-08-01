package main

import (
	"github.com/joho/godotenv"
	"server/services"
	"net/http"
	"fmt"
	"log"
)

func main() {
	err := godotenv.Load(".env")

  if err != nil {
    log.Fatalf("Error loading .env file")
  }

	http.HandleFunc("/token", services.ErrorHandler(services.RequestSpeechToken))

	fmt.Printf("Starting server at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatal(err)
	}
}
