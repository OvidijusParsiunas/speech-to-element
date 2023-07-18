import {Options, WebSpeechAPIOptions} from './types/options';
import {WebSpeech} from './services/webSpeech/webSpeech';
import {Azure} from './services/azure/azure';
import {Speech} from './speech';

export default class SpeechToElement {
  private static _service: Speech | undefined;

  public static toggle(service: 'webspeech' | 'azure', options?: Options) {
    const processedServiceName = service.toLocaleLowerCase().trim();
    if (this._service?.recognizing) {
      this._service.stop();
    } else if (processedServiceName === 'webspeech') {
      SpeechToElement.startWebSpeech(options);
    } else if (processedServiceName === 'azure') {
      SpeechToElement.startAzure(options);
    }
  }

  public static startWebSpeech(options?: Options & WebSpeechAPIOptions) {
    SpeechToElement.stop();
    this._service = new WebSpeech();
    this._service.start(options);
  }

  public static isWebSpeechAPISupported() {
    return !!WebSpeech.getAPI();
  }

  public static startAzure(options?: Options & WebSpeechAPIOptions) {
    SpeechToElement.stop();
    this._service = new Azure();
    this._service.start(options);
  }

  public static stop() {
    if (this._service?.recognizing) {
      this._service.stop();
    }
  }
}
