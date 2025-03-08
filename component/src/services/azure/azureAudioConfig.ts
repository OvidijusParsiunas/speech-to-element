import {AudioConfig} from 'microsoft-cognitiveservices-speech-sdk';

export class AzureAudioConfig {
  public static get(sdkConfigType: typeof AudioConfig, deviceId?: string) {
    if (deviceId) {
      return sdkConfigType.fromMicrophoneInput(deviceId);
    }
    return sdkConfigType.fromDefaultMicrophoneInput();
  }
}
