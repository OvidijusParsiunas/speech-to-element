import requests
import os

# Make sure to set the SUBSCRIPTION_KEY and REGION environment variables in a .env file (create if does not exist) - see .env.example

class Client:
    def request_speech_token(self):
        region = os.getenv("REGION")
        headers = {"Ocp-Apim-Subscription-Key": os.getenv("SUBSCRIPTION_KEY")}
        response = requests.post(f'https://{region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken', headers=headers)
        if (response.status_code != 200): 
            json_response = response.json()
            raise Exception(json_response["error"]["message"])
        return response.text
