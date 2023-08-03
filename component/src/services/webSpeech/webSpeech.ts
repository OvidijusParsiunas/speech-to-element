import {Options, Translations, WebSpeechOptions} from '../../types/options';
import {ExtractFunc, WebSpeechTranscript} from './webSpeechTranscript';
import {Browser} from '../../utils/browser';
import {Speech} from '../../speech';

export class WebSpeech extends Speech {
  // when service is manually stopped events are still fired, this is used to stop more text being added
  private _stopping?: boolean;
  private _service?: SpeechRecognition;
  private _translations?: Translations;
  private _extractText?: ExtractFunc;

  constructor() {
    super();
  }

  start(options?: Options & WebSpeechOptions) {
    if (this._extractText === undefined) {
      this._extractText = Browser.IS_SAFARI() ? WebSpeechTranscript.extractSafari : WebSpeechTranscript.extract;
    }
    if (this.validate()) {
      this.prepareBeforeStart(options);
      this.instantiateService(options);
      this._service?.start();
      this._translations = options?.translations;
    }
  }

  private validate() {
    if (!WebSpeech.getAPI()) {
      this.error('Speech Recognition is unsupported');
      return false;
    }
    return true;
  }

  private instantiateService(options?: Options & WebSpeechOptions) {
    const speechRecognition = WebSpeech.getAPI();
    this._service = new speechRecognition();
    this._service.continuous = true;
    this._service.interimResults = options?.displayInterimResults ?? true;
    this._service.lang = options?.language || 'en-US';
    this.setEvents();
  }

  private setEvents() {
    if (!this._service) return;
    this._service.onstart = () => {
      this.setStateOnStart();
    };

    this._service.onerror = (event) => {
      // this error is thrown in Safari when the service is restarted
      if (Browser.IS_SAFARI() && event.message === 'Another request is started') return;
      if (event.error === 'aborted' && this.isRestarting) return;
      this.error(event.message || event.error);
    };

    // stop is here because onEnd is fired too late
    this._service.onaudioend = () => {
      this.setStateOnStop();
    };

    // setting _stopping here because onend is triggered after extra recognition is fired after sevice has stopped
    this._service.onend = () => {
      this._stopping = false;
    };

    // prettier-ignore
    this._service.onresult = (event: SpeechRecognitionEvent) => {
      if (typeof event.results === 'undefined' && this._service) {
        this._service.onend = null;
        this._service.stop();
        // when service is manually stopped - events are still fired
      } else if (this._extractText && !this._stopping) {
        const {interimTranscript, finalTranscript, newText} = this._extractText(
          event, this.finalTranscript, this._translations);
        this.updateElements(interimTranscript, finalTranscript, newText);
      }
    };
  }

  stop(isDuringReset?: boolean) {
    this._stopping = true;
    this._service?.stop();
    this.finalise(isDuringReset);
  }

  static getAPI() {
    return window.webkitSpeechRecognition || window.SpeechRecognition;
  }

  private error(details: string) {
    console.error(details);
    this.setStateOnError(details);
  }
}
