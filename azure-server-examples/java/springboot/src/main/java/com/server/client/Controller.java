package com.server.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

// Make sure to set the SUBSCRIPTION_KEY and REGION environment variables in application.properties

@RestController
public class Controller {
  @Autowired
  private Client client;

  @GetMapping("/token")
  public String chat() throws Exception {
    return this.client.requestSpeechToken();
  }
}
