package services

import (
	"encoding/json"
	"net/http"
	"strings"
	"errors"
	"bytes"
	"fmt"
	"os"
)

// Make sure to set the SUBSCRIPTION_KEY and REGION environment variables in a .env file (create if does not exist) - see .env.example

func RequestSpeechToken(w http.ResponseWriter, r *http.Request) error {
	fmt.Printf("Requesting token\n")
	err := ProcessIncomingRequest(&w, r)
	if err != nil { return err }
	region := os.Getenv("REGION")
	URL := fmt.Sprintf("https://%s.api.cognitive.microsoft.com/sts/v1.0/issuetoken", region)
	req, _ := http.NewRequest("POST", URL, strings.NewReader(""))
	req.Header.Set("Ocp-Apim-Subscription-Key", os.Getenv("SUBSCRIPTION_KEY"))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil { return err }
	
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		var errorData AzureErrorResponse
		err = json.NewDecoder(resp.Body).Decode(&errorData)
		if err != nil { return err }
	
		if errorData.AzureError.Message != "" {
			return errors.New(errorData.AzureError.Message)
		}
	}
	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(resp.Body)
	if err != nil {
		return err
	}

	w.Write(buf.Bytes())
	return nil
}