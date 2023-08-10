import {AzureOptions, Options, WebSpeechOptions} from './types/options';
import {WebSpeech} from './services/webSpeech/webSpeech';
import {CommandUtils} from './utils/commandUtils';
import {GlobalState} from './utils/globalState';
import {Azure} from './services/azure/azure';

export default class SpeechToElement {
  public static toggle(service: 'webspeech', options?: Options & WebSpeechOptions): void;
  public static toggle(service: 'azure', options: Options & AzureOptions): void;
  public static toggle(service: 'webspeech' | 'azure', options?: Options & WebSpeechOptions & AzureOptions) {
    const processedServiceName = service.toLocaleLowerCase().trim();
    if (GlobalState.service?.recognizing) {
      this.stop();
    } else if (processedServiceName === 'webspeech') {
      SpeechToElement.startWebSpeech(options);
    } else if (processedServiceName === 'azure') {
      SpeechToElement.startAzure(options as Options & AzureOptions);
    } else {
      console.error("service not found - must be either 'webspeech' or 'azure'");
      options?.onError?.("service not found - must be either 'webspeech' or 'azure'");
    }
  }

  public static startWebSpeech(options?: Options & WebSpeechOptions) {
    if (SpeechToElement.stop()) return;
    GlobalState.service = new WebSpeech();
    GlobalState.service.start(options);
  }

  public static isWebSpeechSupported() {
    return !!WebSpeech.getAPI();
  }

  public static startAzure(options: Options & AzureOptions) {
    if (SpeechToElement.stop() || GlobalState.service?.cannotBeStopped) return;
    GlobalState.service = new Azure();
    GlobalState.service.start(options);
  }

  public static stop() {
    if (GlobalState.doubleClickDetector()) return true;
    if (GlobalState.service?.recognizing) {
      GlobalState.service.stop();
    }
    return false;
  }

  public static endCommandMode() {
    if (GlobalState.service) CommandUtils.toggleCommandModeOff(GlobalState.service);
  }
}
