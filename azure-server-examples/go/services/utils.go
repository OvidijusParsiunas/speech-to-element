package services

import (
	"net/http"
	"errors"
	"fmt"
)

func enableCors(w *http.ResponseWriter) {
	// This will need to be reconfigured to suit your app
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func ProcessIncomingRequest(w *http.ResponseWriter, r *http.Request) error {
	enableCors(w)
	if r.Method != "GET" {
		return errors.New("Invalid request method - expected POST, got: " + r.Method)
	}
	return nil
}

func ErrorHandler(f func(w http.ResponseWriter, r *http.Request) error) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    if err := f(w, r); err != nil {
			fmt.Println("Error:", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
    }
  }
}
