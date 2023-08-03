import {AzureOptions, Options, WebSpeechOptions} from './types/options';
import {WebSpeech} from './services/webSpeech/webSpeech';
import {CommandUtils} from './utils/commandUtils';
import {Azure} from './services/azure/azure';
import {Speech} from './speech';

export default class SpeechToElement {
  private static _service: Speech | undefined;

  public static toggle(service: 'webspeech', options?: Options & WebSpeechOptions): void;
  public static toggle(service: 'azure', options: Options & AzureOptions): void;
  public static toggle(service: 'webspeech' | 'azure', options?: Options & WebSpeechOptions & AzureOptions) {
    const processedServiceName = service.toLocaleLowerCase().trim();
    if (this._service?.recognizing) {
      this._service.stop();
    } else if (processedServiceName === 'webspeech') {
      SpeechToElement.startWebSpeech(options);
    } else if (processedServiceName === 'azure') {
      SpeechToElement.startAzure(options as Options & AzureOptions);
    } else {
      console.error("service not found - must be either 'webspeech' or 'azure'");
    }
  }

  public static startWebSpeech(options?: Options & WebSpeechOptions) {
    SpeechToElement.stop();
    this._service = new WebSpeech();
    this._service.start(options);
  }

  public static isWebSpeechSupported() {
    return !!WebSpeech.getAPI();
  }

  public static startAzure(options: Options & AzureOptions) {
    SpeechToElement.stop();
    this._service = new Azure();
    this._service.start(options);
  }

  public static stop() {
    if (this._service?.recognizing) {
      this._service.stop();
    }
  }

  public static endCommandMode() {
    if (this._service) CommandUtils.toggleCommandModeOff(this._service);
  }
}

module.exports = SpeechToElement;
