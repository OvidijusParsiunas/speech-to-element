import {TextElements} from './textElements';
import {Options} from './types/options';
import {TextUtils} from './textUtils';

export abstract class Speech {
  private _finalTranscript = '';
  private readonly _initialInputValue: string = '';
  private _input?: HTMLInputElement;
  private readonly _interimSpan: HTMLSpanElement = TextElements.createInterimSpan();
  private readonly _finalSpan: HTMLSpanElement = TextElements.createFinalSpan();
  recognizing = false;

  constructor(options?: Options) {
    if (options?.element) {
      if (options.element.tagName === 'INPUT') {
        const input = options.element as HTMLInputElement;
        this._initialInputValue = input.value;
        if (TextUtils.isLastCharDefined(input.value)) {
          this._finalTranscript = ' ';
        }
        this._input = input;
      } else {
        if (TextUtils.isLastCharDefined(options.element.innerText)) {
          this._finalTranscript = ' ';
          this._finalSpan.innerHTML = ' ';
          this._interimSpan.innerHTML = ' ';
        }
        options.element.appendChild(this._finalSpan);
        options.element.appendChild(this._interimSpan);
      }
    }
  }

  updateElement(interimTranscript: string, finalStranscript: string) {
    this._finalTranscript = TextUtils.capitalize(finalStranscript);
    if (this._input) {
      this._input.value = this._initialInputValue + this._finalTranscript + interimTranscript;
    } else {
      this._finalSpan.innerHTML = TextUtils.lineBreak(this._finalTranscript);
      this._interimSpan.innerHTML = TextUtils.lineBreak(interimTranscript);
    }
  }

  reset() {
    this.stop();
    this._input = undefined;
    this._finalTranscript = '';
    this._finalSpan.innerHTML = '';
    this._interimSpan.innerHTML = '';
  }

  abstract stop(): void;
}
