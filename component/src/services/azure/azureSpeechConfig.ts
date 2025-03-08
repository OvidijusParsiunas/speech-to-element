import {SpeechConfig} from 'microsoft-cognitiveservices-speech-sdk';
import {AzureOptions} from '../../types/options';
import {README_URL} from '../../consts/readme';

export class AzureSpeechConfig {
  public static validateOptions(onError: (details: string) => void, options?: AzureOptions) {
    if (!options) {
      onError(`Please provide subscription details - more info: ${README_URL}`);
      return false;
    }
    if (!options.subscriptionKey && !options.token && !options.retrieveToken) {
      onError(`Please define a 'subscriptionKey', 'token' or 'retrieveToken' property - more info: ${README_URL}`);
      return false;
    }
    if (!options.region) {
      onError(`Please define a 'region' property - more info: ${README_URL}`);
      return false;
    }
    return true;
  }

  private static async getNewSpeechConfig(sdkSpeechConfig: typeof SpeechConfig, options: AzureOptions) {
    if (!options.region) return;
    if (options.subscriptionKey) {
      return sdkSpeechConfig.fromSubscription(options.subscriptionKey.trim(), options.region.trim());
    }
    if (options.token) {
      return sdkSpeechConfig.fromAuthorizationToken(options.token.trim(), options.region.trim());
    }
    if (options.retrieveToken) {
      return options
        .retrieveToken()
        .then((token) => {
          return options.region
            ? sdkSpeechConfig.fromAuthorizationToken(token?.trim() || '', options.region.trim())
            : null;
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
    }
    return null;
  }

  private static process(sdkSpeechConfig: SpeechConfig, options: AzureOptions) {
    if (options.endpointId) sdkSpeechConfig.endpointId = options.endpointId.trim();
    if (options.language) sdkSpeechConfig.speechRecognitionLanguage = options.language.trim();
  }

  public static async get(sdkConfigType: typeof SpeechConfig, options: AzureOptions) {
    const speechConfig = await AzureSpeechConfig.getNewSpeechConfig(sdkConfigType, options);
    if (speechConfig) AzureSpeechConfig.process(speechConfig, options);
    return speechConfig;
  }
}
