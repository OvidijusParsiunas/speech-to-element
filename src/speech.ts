import {TextElements} from './textElements';
import {Options} from './types/options';
import {Padding} from './utils/padding';
import {Text} from './utils/text';

export abstract class Speech {
  finalTranscript = '';
  // used for editable element
  private _interimSpan: HTMLSpanElement = TextElements.createInterimSpan();
  private _finalSpan: HTMLSpanElement = TextElements.createFinalSpan();
  // used for input/textarea elements that don't allow spans
  private _primitiveElement?: HTMLInputElement;
  private _genericElement?: HTMLElement;
  private _spansPopulated = false;
  // stored in state to detach it
  private _resetRecordingFunc?: () => void;
  startPadding = '';
  endPadding = '';
  recognizing = false;

  constructor() {
    this.resetState();
  }

  prepareBeforeStart(options?: Options) {
    if (options?.element) {
      this._resetRecordingFunc = this.resetRecording.bind(this, options);
      options.element.addEventListener('click', this._resetRecordingFunc);
      Padding.setState(this, options.element);
      if (options.element.tagName === 'INPUT' || options.element.tagName === 'TEXTAREA') {
        const input = options.element as HTMLInputElement;
        this._primitiveElement = input;
        Padding.adjustStateForPrimitiveElement(this, input);
      } else {
        this._genericElement = options.element;
      }
    }
  }

  private resetRecording(options?: Options) {
    this.stop(true);
    this.resetState();
    this.start(options);
  }

  private appendSpans(element: HTMLElement) {
    this._spansPopulated = true;
    if (document.activeElement === element) {
      const selection = window.getSelection();
      if (selection?.focusNode) {
        const newRange = selection.getRangeAt(0);
        newRange.insertNode(this._interimSpan);
        newRange.insertNode(this._finalSpan);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
        return;
      }
    }
    element.appendChild(this._finalSpan);
    element.appendChild(this._interimSpan);
  }

  updateElement(interimTranscript: string, finalStranscript: string) {
    this.finalTranscript = Text.capitalize(finalStranscript);
    if (this._primitiveElement) {
      this._primitiveElement.value = this.startPadding + this.finalTranscript + interimTranscript + this.endPadding;
    } else {
      if (this._genericElement && !this._spansPopulated) this.appendSpans(this._genericElement);
      this._finalSpan.innerHTML = this.startPadding + Text.lineBreak(this.finalTranscript);
      this._interimSpan.innerHTML = Text.lineBreak(interimTranscript) + this.endPadding;
    }
  }

  finalise(isDuringReset?: boolean) {
    if (this._genericElement) {
      if (isDuringReset) {
        this._finalSpan = TextElements.createFinalSpan();
        this._interimSpan.style.color = 'black';
        this._interimSpan = TextElements.createInterimSpan();
      } else {
        this._genericElement.textContent = this._genericElement.textContent as string;
      }
      this._genericElement.removeEventListener('click', this._resetRecordingFunc as EventListener);
      this._spansPopulated = false;
    } else if (this._primitiveElement) {
      this._primitiveElement.removeEventListener('click', this._resetRecordingFunc as EventListener);
    }
  }

  private resetState() {
    this._primitiveElement = undefined;
    this._genericElement = undefined;
    this.finalTranscript = '';
    this._finalSpan.innerHTML = '';
    this._interimSpan.innerHTML = '';
    this.startPadding = '';
    this.endPadding = '';
  }

  abstract start(options?: Options): void;

  abstract stop(isDuringReset?: boolean): void;
}
