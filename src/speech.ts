import {WindowListeners} from './utils/windowListeners';
import {Highlight} from './utils/highlight';
import {Elements} from './utils/elements';
import {Options} from './types/options';
import {Padding} from './utils/padding';
import {Cursor} from './utils/cursor';
import {Text} from './utils/text';

// WORK - when the user types with their keyboard - set timeout to not have to restart for every keyboard click
// WORK - set cursor at end of the new input text
export abstract class Speech {
  finalTranscript = '';
  // used for editable element
  interimSpan: HTMLSpanElement = Elements.createInterimSpan();
  finalSpan: HTMLSpanElement = Elements.createFinalSpan();
  // used for input/textarea elements that don't allow spans
  private _primitiveElement?: HTMLInputElement;
  private _genericElement?: HTMLElement;
  spansPopulated = false;
  // stored in state to detach listeners
  mouseDownEvent?: (event: MouseEvent) => void;
  mouseUpEvent?: (event: MouseEvent) => void;
  startPadding = '';
  // primitive elements use this as the right hand side text of cursor
  endPadding = '';
  numberOfSpacesAfterNewText = 0; // primarily used for setting cursor for primitive elements
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

  updateElement(interimTranscript: string, finalTranscript: string) {
    if (finalTranscript === '' && interimTranscript === '') return;
    this.finalTranscript = Text.capitalize(finalTranscript);
    if (this._primitiveElement) {
      if (this.isHighlighted) Highlight.removeForPrimitive(this, this._primitiveElement);
      if (!this.primitiveTextRecorded) Padding.adjustStateForPrimitiveElement(this, this._primitiveElement);
      const cursorLefSideText = this.startPadding + this.finalTranscript + interimTranscript;
      this._primitiveElement.value = cursorLefSideText + this.endPadding;
      Cursor.setOffsetForPrimitive(this._primitiveElement, cursorLefSideText.length + this.numberOfSpacesAfterNewText);
    } else if (this._genericElement) {
      if (this.isHighlighted) Highlight.removeForGeneric(this, this._genericElement);
      if (!this.spansPopulated) Elements.appendSpans(this, this._genericElement);
      const finalText = this.startPadding + Text.lineBreak(this.finalTranscript);
      this.finalSpan.innerHTML = finalText;
      const interimText = Text.lineBreak(interimTranscript) + this.endPadding;
      this.interimSpan.innerHTML = interimText;
    }
  }

  finalise(isDuringReset?: boolean) {
    if (this._genericElement) {
      if (isDuringReset) {
        this.finalSpan = Elements.createFinalSpan();
        this.interimSpan.style.color = 'black';
        this.interimSpan = Elements.createInterimSpan();
      } else {
        this._genericElement.textContent = this._genericElement.textContent as string;
      }
      this.spansPopulated = false;
    }
    WindowListeners.remove(this);
  }

  private resetState() {
    this._primitiveElement = undefined;
    this._genericElement = undefined;
    this.finalTranscript = '';
    this.finalSpan.innerHTML = '';
    this.interimSpan.innerHTML = '';
    this.startPadding = '';
    this.endPadding = '';
    this.isHighlighted = false;
    this.primitiveTextRecorded = false;
    this.numberOfSpacesAfterNewText = 0;
  }

  abstract start(options?: Options): void;

  abstract stop(isDuringReset?: boolean): void;
}
