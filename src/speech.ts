import {WindowListeners} from './utils/windowListeners';
import {TextElements} from './textElements';
import {Highlight} from './utils/highlight';
import {Options} from './types/options';
import {Padding} from './utils/padding';
import {Text} from './utils/text';

// WORK - when the user types with their keyboard - set timeout to not have to restart for every keyboard click
// WORK - set cursor at end of the new input text
export abstract class Speech {
  finalTranscript = '';
  // used for editable element
  private _interimSpan: HTMLSpanElement = TextElements.createInterimSpan();
  private _finalSpan: HTMLSpanElement = TextElements.createFinalSpan();
  // used for input/textarea elements that don't allow spans
  private _primitiveElement?: HTMLInputElement;
  private _genericElement?: HTMLElement;
  private _spansPopulated = false;
  // stored in state to detach listeners
  mouseDownEvent?: (event: MouseEvent) => void;
  mouseUpEvent?: (event: MouseEvent) => void;
  startPadding = '';
  endPadding = '';
  isHighlighted = false;
  primitiveTextRecorded = false;
  recognizing = false;
  mouseDownElement?: HTMLElement;

  constructor() {
    this.resetState();
  }

  prepareBeforeStart(options?: Options) {
    if (options?.element) {
      Padding.setState(this, options.element);
      Highlight.setState(this, options.element);
      WindowListeners.add(this, options);
      if (options.element.tagName === 'INPUT' || options.element.tagName === 'TEXTAREA') {
        const input = options.element as HTMLInputElement;
        this._primitiveElement = input;
      } else {
        this._genericElement = options.element;
      }
    }
  }

  resetRecording(options?: Options) {
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

  updateElement(interimTranscript: string, finalTranscript: string) {
    if (finalTranscript === '' && interimTranscript === '') return;
    this.finalTranscript = Text.capitalize(finalTranscript);
    if (this._primitiveElement) {
      if (this.isHighlighted) Highlight.removeForPrimitive(this, this._primitiveElement);
      if (!this.primitiveTextRecorded) Padding.adjustStateForPrimitiveElement(this, this._primitiveElement);
      this._primitiveElement.value = this.startPadding + this.finalTranscript + interimTranscript + this.endPadding;
    } else if (this._genericElement) {
      if (this.isHighlighted) Highlight.removeForGeneric(this, this._genericElement);
      if (!this._spansPopulated) this.appendSpans(this._genericElement);
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
      this._spansPopulated = false;
    }
    WindowListeners.remove(this);
  }

  private resetState() {
    this._primitiveElement = undefined;
    this._genericElement = undefined;
    this.finalTranscript = '';
    this._finalSpan.innerHTML = '';
    this._interimSpan.innerHTML = '';
    this.startPadding = '';
    this.endPadding = '';
    this.isHighlighted = false;
    this.primitiveTextRecorded = false;
  }

  abstract start(options?: Options): void;

  abstract stop(isDuringReset?: boolean): void;
}
