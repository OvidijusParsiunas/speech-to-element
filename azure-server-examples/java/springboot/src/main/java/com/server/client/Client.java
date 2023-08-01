package com.server.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

// Make sure to set the SUBSCRIPTION_KEY environment variable in application.properties

@Service
public class Client {
  private static final Logger LOGGER = LoggerFactory.getLogger(Client.class);

  @Value("${SUBSCRIPTION_KEY}")
  private String subscriptionKey;
  
  public String requestSpeechToken() throws Exception {
    LOGGER.info("Requesting token");

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.set("Ocp-Apim-Subscription-Key", subscriptionKey);
    String region = "eastus";
    String URL = String.format("https://%s.api.cognitive.microsoft.com/sts/v1.0/issuetoken", region);
    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(URL);

    ResponseEntity<String> response = restTemplate.exchange(
      builder.toUriString(), HttpMethod.POST, new HttpEntity<>(headers), String.class);
    if (response.getStatusCode().value() != 200) {
      throw new Exception("Unexpected response from Azure");
    }
    return response.getBody();
  }
}
