import {WebSpeechAPITranscript} from './webSpeechAPITranscript';
import {Options} from '../types/options';
import {Speech} from '../speech';

export class WebSpeechAPI extends Speech {
  private readonly _service?: SpeechRecognition;

  constructor(options?: Options) {
    super(options);
    const speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!speechRecognition) {
      console.error('Speech Recognition is unsupported');
    } else {
      this.reset();
      // recognition.lang = select_dialect.value;
      this._service = new speechRecognition();
      this._service.continuous = true;
      this._service.interimResults = options?.displayInterimResults ?? true;
      this._service.lang = 'en-US';
      if (options?.grammar) WebSpeechAPI.setGrammar(this._service);
      this.setEvents();
      this._service.start();
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
      console.error('Speech to text error:');
      console.error(event);
    };

    this._service.onend = () => {
      this.recognizing = false;
    };

    this._service.onresult = (event) => {
      if (typeof event.results === 'undefined' && this._service) {
        this._service.onend = null;
        this._service.stop();
      } else {
        const {interimTranscript, finalTranscript} = WebSpeechAPITranscript.get(event);
        this.updateElement(interimTranscript, finalTranscript);
      }
    };
  }

  stop() {
    this._service?.stop();
  }
}
