package services

type AzureErrorResponse struct {
	AzureError AzureError `json:"error"`
}

type AzureError struct {
	Message string `json:"message"`
}
