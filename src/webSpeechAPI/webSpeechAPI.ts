import {ExtractFunc, WebSpeechAPITranscript} from './webSpeechAPITranscript';
import {OnError, Options} from '../types/options';
import {Browser} from '../utils/browser';
import {Speech} from '../speech';

export class WebSpeechAPI extends Speech {
  private _service?: SpeechRecognition;
  private _onError?: OnError;
  private readonly _extractText?: ExtractFunc;

  constructor() {
    super();
    this._extractText = Browser.IS_SAFARI ? WebSpeechAPITranscript.extractSafari : WebSpeechAPITranscript.extract;
  }

  start(options?: Options) {
    this.prepareBeforeStart(options);
    this.instantiateService(options);
    this._service?.start();
    this._onError = options?.onError;
  }

  private instantiateService(options?: Options) {
    const speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!speechRecognition) {
      console.error('Speech Recognition is unsupported');
    } else {
      // recognition.lang = select_dialect.value;
      this._service = new speechRecognition();
      this._service.continuous = true;
      this._service.interimResults = options?.displayInterimResults ?? true;
      this._service.lang = 'en-US';
      if (options?.grammar) WebSpeechAPI.setGrammar(this._service);
      this.setEvents();
    }
  }

  private static setGrammar(service: SpeechRecognition) {
    const speechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
    if (speechGrammarList) {
      const speechRecognitionList = new SpeechGrammarList();
      // WORK - this needs to be tested
      const grammar =
        // eslint-disable-next-line max-len
        '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghost | white | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';
      speechRecognitionList.addFromString(grammar, 1);
      service.grammars = speechRecognitionList;
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
        const {interimTranscript, finalTranscript} = this._extractText(event, this.finalTranscript);
        this.updateElements(interimTranscript, finalTranscript);
      }
    };
  }

  stop(isDuringReset?: boolean) {
    this._service?.stop();
    this.finalise(isDuringReset);
  }

  static isSupported(): boolean {
    return !!window.webkitSpeechRecognition || window.SpeechRecognition;
  }
}
