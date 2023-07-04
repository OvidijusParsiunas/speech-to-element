import {EventListeners} from './utils/eventListeners';
import {StopTimeout} from './utils/stopTimeout';
import {Highlight} from './utils/highlight';
import {Elements} from './utils/elements';
import {Options} from './types/options';
import {Padding} from './utils/padding';
import {Browser} from './utils/browser';
import {Cursor} from './utils/cursor';
import {Text} from './utils/text';

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
  keyDownEvent?: (event: KeyboardEvent) => void;
  startPadding = '';
  // primitive elements use this as the right hand side text of cursor
  endPadding = '';
  numberOfSpacesAfterNewText = 0; // primarily used for setting cursor for primitive elements
  isHighlighted = false;
  primitiveTextRecorded = false;
  recognizing = false;
  mouseDownElement?: HTMLElement;
  private _displayInterimResults = true;
  private _finalTextColor?: string;
  stopTimeout?: number;
  stopTimeoutMS?: number;

  constructor() {
    this.resetState();
  }

  prepareBeforeStart(options?: Options) {
    if (options?.element) {
      Padding.setState(this, options.element);
      Highlight.setState(this, options.element);
      EventListeners.add(this, options);
      if (options.element.tagName === 'INPUT' || options.element.tagName === 'TEXTAREA') {
        const input = options.element as HTMLInputElement;
        this._primitiveElement = input;
      } else {
        this._genericElement = options.element;
      }
    }
    if (options?.displayInterimResults !== undefined) this._displayInterimResults = options.displayInterimResults;
    if (options?.textColor) {
      this._finalTextColor = options?.textColor?.final;
      Elements.applyCustomColors(this, options.textColor);
    }
    if (this.stopTimeout === undefined) StopTimeout.reset(this, options?.stopAfterSilenceMS);
  }

  resetRecording(options?: Options) {
    this.stop(true);
    this.resetState(true);
    this.start(options);
  }

  updateElements(interimTranscript: string, finalTranscript: string) {
    const newFinalText = Text.capitalize(finalTranscript);
    if (this.finalTranscript === newFinalText && interimTranscript === '') return;
    StopTimeout.reset(this, this.stopTimeoutMS);
    this.finalTranscript = newFinalText;
    if (!this._displayInterimResults) interimTranscript = '';
    if (this._primitiveElement) {
      if (this.isHighlighted) Highlight.removeForPrimitive(this, this._primitiveElement);
      if (!this.primitiveTextRecorded) Padding.adjustStateForPrimitiveElement(this, this._primitiveElement);
      const cursorLefSideText = this.startPadding + this.finalTranscript + interimTranscript;
      this._primitiveElement.value = cursorLefSideText + this.endPadding;
      Cursor.setOffsetForPrimitive(this._primitiveElement, cursorLefSideText.length + this.numberOfSpacesAfterNewText);
    } else if (this._genericElement) {
      if (this.isHighlighted) Highlight.removeForGeneric(this, this._genericElement);
      if (!this.spansPopulated) Elements.appendSpans(this, this._genericElement);
      // for web speech api - safari only returns final text - no interim
      const finalText = this.startPadding + Text.lineBreak(this.finalTranscript);
      this.finalSpan.innerHTML = finalText;
      const interimText = Text.lineBreak(interimTranscript) + this.endPadding;
      this.interimSpan.innerHTML = interimText;
      if (Browser.IS_SAFARI) Cursor.setOffsetForSafariGeneric(this._genericElement, finalText.length + interimText.length);
    }
  }

  finalise(isDuringReset?: boolean) {
    if (this._genericElement) {
      if (isDuringReset) {
        this.finalSpan = Elements.createFinalSpan();
        this.interimSpan.style.color = this._finalTextColor || 'black';
        this.interimSpan = Elements.createInterimSpan();
      } else {
        this._genericElement.textContent = this._genericElement.textContent as string;
      }
      this.spansPopulated = false;
    }
    EventListeners.remove(this, this._genericElement || this._primitiveElement);
  }

  private resetState(isDuringReset?: boolean) {
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
    if (!isDuringReset) this.stopTimeout = undefined;
  }

  abstract start(options?: Options): void;

  abstract stop(isDuringReset?: boolean): void;
}
