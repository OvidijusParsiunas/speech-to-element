import {SpeechConfig} from 'microsoft-cognitiveservices-speech-sdk';
import {AzureOptions} from '../../types/options';
import {README_URL} from '../../consts/readme';

export class AzureSpeechConfig {
  private static getNewSpeechConfig(sdkSpeechConfig: typeof SpeechConfig, options: AzureOptions) {
    if (!options) {
      console.error(`Please provide subscription details - more info: ${README_URL}`);
      return null;
    }
    if (options.retrieveToken) {
      // here
      return null;
    }
    if (!options.subscriptionKey || !options.token) {
      console.error(`Please define a 'subscriptionKey' or 'token' property - more info: ${README_URL}`);
      return null;
    }
    if (!options.region) {
      console.error(`Please define a 'region' property - more info: ${README_URL}`);
      return null;
    }
    // WORK - error handling for incorrect key
    if (options.subscriptionKey) {
      return sdkSpeechConfig.fromSubscription(options.subscriptionKey, options.region);
    }
    if (options.token) {
      return sdkSpeechConfig.fromAuthorizationToken(options.token, options.region);
    }
    return null;
  }

  private static process(sdkSpeechConfig: SpeechConfig, options: AzureOptions) {
    if (options.language) sdkSpeechConfig.speechRecognitionLanguage = options.language;
  }

  public static get(sdkConfigType: typeof SpeechConfig, options: AzureOptions) {
    const speechConfig = AzureSpeechConfig.getNewSpeechConfig(sdkConfigType, options);
    if (speechConfig) AzureSpeechConfig.process(speechConfig, options);
    return speechConfig;
  }
}
