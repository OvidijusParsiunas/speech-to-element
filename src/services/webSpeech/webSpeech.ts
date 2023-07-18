import {OnError, Options, Translations, WebSpeechAPIOptions} from '../../types/options';
import {ExtractFunc, WebSpeechTranscript} from './webSpeechTranscript';
import {Browser} from '../../utils/browser';
import {Speech} from '../../speech';

export class WebSpeech extends Speech {
  private _service?: SpeechRecognition;
  private _onError?: OnError;
  private _translations?: Translations;
  private readonly _extractText?: ExtractFunc;

  constructor() {
    super();
    this._extractText = Browser.IS_SAFARI ? WebSpeechTranscript.extractSafari : WebSpeechTranscript.extract;
  }

  start(options?: Options & WebSpeechAPIOptions) {
    this.prepareBeforeStart(options);
    this.instantiateService(options);
    this._service?.start();
    this._onError = options?.onError;
    this._translations = options?.translations;
  }

  private instantiateService(options?: Options & WebSpeechAPIOptions) {
    const speechRecognition = WebSpeech.getAPI();
    if (!speechRecognition) {
      console.error('Speech Recognition is unsupported');
    } else {
      this._service = new speechRecognition();
      this._service.continuous = true;
      this._service.interimResults = options?.displayInterimResults ?? true;
      this._service.lang = options?.lang || 'en-US';
      this.setEvents();
    }
  }

  private setEvents() {
    if (!this._service) return;
    this._service.onstart = () => {
      this.recognizing = true;
    };

    this._service.onerror = (event) => {
      // this error is thrown in Safari when the service is restarted
      if (Browser.IS_SAFARI && event.message === 'Another request is started') return;
      console.error(event.message);
      this._onError?.(event.message);
    };

    this._service.onend = () => {
      this.recognizing = false;
    };

    this._service.onresult = (event: SpeechRecognitionEvent) => {
      if (typeof event.results === 'undefined' && this._service) {
        this._service.onend = null;
        this._service.stop();
      } else if (this._extractText) {
        const {interimTranscript, finalTranscript} = this._extractText(event, this.finalTranscript, this._translations);
        this.updateElements(interimTranscript, finalTranscript);
      }
    };
  }

  stop(isDuringReset?: boolean) {
    this._service?.stop();
    this.finalise(isDuringReset);
  }

  static getAPI() {
    return window.webkitSpeechRecognition || window.SpeechRecognition;
  }
}
