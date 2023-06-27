import {TextElements} from './textElements';
import {Options} from './types/options';
import {TextUtils} from './textUtils';

export abstract class Speech {
  finalTranscript = '';
  // used for editable element
  private readonly _interimSpan: HTMLSpanElement = TextElements.createInterimSpan();
  private readonly _finalSpan: HTMLSpanElement = TextElements.createFinalSpan();
  // used for input/textarea elements
  private readonly _initialPrimitiveElementValue: string = '';
  private _primitiveElement?: HTMLInputElement;
  recognizing = false;

  constructor(options?: Options) {
    this.reset();
    if (options?.element) {
      if (options.element.tagName === 'INPUT' || options.element.tagName === 'TEXTAREA') {
        const input = options.element as HTMLInputElement;
        this._initialPrimitiveElementValue = input.value;
        if (TextUtils.isLastCharDefined(input.value)) {
          this.finalTranscript = ' ';
        }
        this._primitiveElement = input;
      } else {
        if (TextUtils.isLastCharDefined(options.element.innerText)) {
          this.finalTranscript = ' ';
          this._finalSpan.innerHTML = ' ';
          this._interimSpan.innerHTML = ' ';
        }
        options.element.appendChild(this._finalSpan);
        options.element.appendChild(this._interimSpan);
      }
    }
  }

  updateElement(interimTranscript: string, finalStranscript: string) {
    this.finalTranscript = TextUtils.capitalize(finalStranscript);
    if (this._primitiveElement) {
      this._primitiveElement.value = this._initialPrimitiveElementValue + this.finalTranscript + interimTranscript;
    } else {
      this._finalSpan.innerHTML = TextUtils.lineBreak(this.finalTranscript);
      this._interimSpan.innerHTML = TextUtils.lineBreak(interimTranscript);
    }
  }

  private reset() {
    this.stop();
    this._primitiveElement = undefined;
    this.finalTranscript = '';
    this._finalSpan.innerHTML = '';
    this._interimSpan.innerHTML = '';
  }

  abstract stop(): void;
}
