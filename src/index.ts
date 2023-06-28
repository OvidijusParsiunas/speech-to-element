import {WebSpeechAPI} from './webSpeechAPI/webSpeechAPI';
import {Options} from './types/options';
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

  public static start(options?: Options) {
    this._service = new WebSpeechAPI(options);
    this._service.start();
  }

  public static stop() {
    if (this._service?.recognizing) {
      this._service.stop();
    }
  }
}
