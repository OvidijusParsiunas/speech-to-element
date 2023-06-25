import {ProcessText} from './processText';

export default class SpeechToInput {
  private static _speech?: SpeechRecognition;
  private static _recognizing = false;
  private static _ignore_onend = false;
  private static _final_transcript = '';
  private static readonly _interim_span: HTMLSpanElement = document.createElement('span');
  private static readonly _final_span: HTMLSpanElement = document.createElement('span');

  public static start(options?: {callback?: () => string; grammar?: string[]; element?: HTMLElement}) {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speechRecognition) {
      console.error('Speech Recognition is unsupported');
    } else {
      SpeechToInput.reset();
      // recognition.lang = select_dialect.value;
      this._speech = new speechRecognition();
      this._speech.continuous = true;
      this._speech.interimResults = true;
      if (options?.grammar) {
        const speechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
        if (speechGrammarList) {
          const speechRecognitionList = new SpeechGrammarList();
          // WORK - this needs to be tested
          const grammar =
            // eslint-disable-next-line max-len
            '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghost | white | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;';
          speechRecognitionList.addFromString(grammar, 1);
          this._speech.grammars = speechRecognitionList;
        }
      }

      if (options?.element) {
        options.element.appendChild(this._interim_span);
        options.element.appendChild(this._final_span);
      }

      this._speech.onstart = () => {
        this._recognizing = true;
      };

      this._speech.onerror = (event) => {
        this._ignore_onend = true;
        console.error('Speech to text error:');
        console.error(event);
      };

      this._speech.onend = () => {
        this._recognizing = false;
        if (this._ignore_onend) {
          return;
        }
        if (!this._final_transcript) {
          return;
        }
        if (window?.getSelection && this._final_span) {
          window.getSelection()?.removeAllRanges();
          const range = document.createRange();
          range.selectNode(this._final_span);
          window.getSelection()?.addRange(range);
        }
      };

      this._speech.onresult = (event) => {
        let interim_transcript = '';
        if (typeof event.results === 'undefined' && this._speech) {
          this._speech.onend = null;
          this._speech.stop();
          return;
        }
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this._final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        this._final_transcript = ProcessText.capitalize(this._final_transcript);
        this._final_span.innerHTML = ProcessText.linebreak(this._final_transcript);
        this._interim_span.innerHTML = ProcessText.linebreak(interim_transcript);
      };
      this._speech.start();
    }
  }

  private static reset() {
    SpeechToInput.stop();
    this._final_transcript = '';
    this._ignore_onend = false;
    this._final_span.innerHTML = '';
    this._interim_span.innerHTML = '';
  }

  public static stop() {
    if (this._recognizing && this._speech) {
      this._speech.stop();
    }
  }
}
