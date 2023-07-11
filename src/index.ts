import {Options, WebSpeechAPIOptions} from './types/options';
import {WebSpeechAPI} from './webSpeechAPI/webSpeechAPI';
import {Speech} from './speech';

export default class SpeechToElement {
  private static _service: Speech | undefined;

  public static toggle(options?: Options) {
    if (this._service?.recognizing) {
      SpeechToElement.stop();
    } else {
      SpeechToElement.start(options);
    }
  }

  public static start(options?: Options & WebSpeechAPIOptions) {
    this._service = new WebSpeechAPI();
    this._service.start(options);
  }

  public static stop() {
    if (this._service?.recognizing) {
      this._service.stop();
    }
  }

  public static isWebSpeechAPISupported() {
    return WebSpeechAPI.isSupported();
  }
}
