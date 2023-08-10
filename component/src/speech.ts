import {OnCommandModeTrigger, OnError, OnPauseTrigger, OnPreResult, OnResult, Options} from './types/options';
import {InternalCommands} from './types/internalCommands';
import {EventListeners} from './utils/eventListeners';
import {PreResultUtils} from './utils/preResultUtils';
import {CommandUtils} from './utils/commandUtils';
import {AutoScroll} from './utils/autoScroll';
import {Highlight} from './utils/highlight';
import {Elements} from './utils/elements';
import {Padding} from './utils/padding';
import {Browser} from './utils/browser';
import {Cursor} from './utils/cursor';
import {Text} from './utils/text';

export abstract class Speech {
  finalTranscript = '';
  // used for editable element
  interimSpan = Elements.createInterimSpan();
  finalSpan = Elements.createGenericSpan();
  // used for allowing autoScroll() to scroll to it when interimSpan enters another line and doesn't scroll
  scrollingSpan = Elements.createGenericSpan();
  isCursorAtEnd = false;
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
  numberOfSpacesBeforeNewText = 0; // primarily used for setting cursor for primitive elements
  numberOfSpacesAfterNewText = 0; // primarily used for setting cursor for primitive elements
  isHighlighted = false;
  primitiveTextRecorded = false;
  recognizing = false;
  mouseDownElement?: Element;
  private _displayInterimResults = true;
  private _finalTextColor?: string;
  stopTimeout?: NodeJS.Timeout;
  stopTimeoutMS?: number;
  insertInCursorLocation = true;
  autoScroll = true;
  private _onResult?: OnResult;
  private _onPreResult?: OnPreResult;
  private _onStart?: () => void;
  private _onStop?: () => void;
  private _onError?: OnError;
  isRestarting = false;
  private _options?: Options;
  private _originalText?: string;
  onCommandModeTrigger?: OnCommandModeTrigger;
  onPauseTrigger?: OnPauseTrigger;
  isPaused = false;
  commands?: InternalCommands;
  isWaitingForCommand = false;
  isTargetInShadow = false;
  cannotBeStopped = false; // this is mostly used for Azure to prevent user from stopping when it is connecting

  constructor() {
    this.resetState();
  }

  prepareBeforeStart(options?: Options) {
    if (options?.element) {
      EventListeners.add(this, options);
      if (Array.isArray(options.element)) {
        // checks if any of available elements are currently focused, else proceeds to the first
        const focusedElement = options.element.find((element) => element === document.activeElement);
        const targetElement = focusedElement || options.element[0];
        if (!targetElement) return;
        this.prepare(targetElement as HTMLElement);
      } else {
        this.prepare(options.element as HTMLElement);
      }
    }
    if (options?.displayInterimResults !== undefined) this._displayInterimResults = options.displayInterimResults;
    if (options?.textColor) {
      this._finalTextColor = options?.textColor?.final;
      Elements.applyCustomColors(this, options.textColor);
    }
    if (options?.insertInCursorLocation !== undefined) this.insertInCursorLocation = options.insertInCursorLocation;
    if (options?.autoScroll !== undefined) this.autoScroll = options.autoScroll;
    this._onResult = options?.onResult;
    this._onPreResult = options?.onPreResult;
    this._onStart = options?.onStart;
    this._onStop = options?.onStop;
    this._onError = options?.onError;
    this.onCommandModeTrigger = options?.onCommandModeTrigger;
    this.onPauseTrigger = options?.onPauseTrigger;
    this._options = options;
    if (this._options?.commands) this.commands = CommandUtils.process(this._options.commands);
  }

  private prepare(targetElement: HTMLElement) {
    Padding.setState(this, targetElement);
    Highlight.setState(this, targetElement);
    this.isTargetInShadow = Elements.isInsideShadowDOM(targetElement);
    if (Elements.isPrimitiveElement(targetElement)) {
      this._primitiveElement = targetElement as HTMLInputElement;
      this._originalText = this._primitiveElement.value;
    } else {
      this._genericElement = targetElement;
      this._originalText = this._genericElement.textContent as string;
    }
  }

  // there was an attempt to optimize this by not having to restart the service and just reset state:
  // unfortunately it did not work because the service would still continue firing the intermediate and final results
  // into the new position
  resetRecording(options?: Options) {
    this.isRestarting = true;
    this.stop(true);
    this.resetState(true);
    this.start(options, true);
  }

  // prettier-ignore
  updateElements(interimTranscript: string, finalTranscript: string, newText: string) {
    const newFinalText = Text.capitalize(finalTranscript);
    if (this.finalTranscript === newFinalText && interimTranscript === '') return;
    if (PreResultUtils.process(this, newText, interimTranscript === '', this._onPreResult, this._options)) {
      interimTranscript = '', newText = '';
    }
    const commandResult = this.commands && CommandUtils.execCommand(this,
      newText, this._options, this._primitiveElement || this._genericElement, this._originalText);
    if (commandResult) {
      if (commandResult.doNotProcessTranscription) return;
      interimTranscript = '', newText = '';
    }
    if (this.isPaused || this.isWaitingForCommand) return;
    this._onResult?.(newText, interimTranscript === '');
    this.finalTranscript = newFinalText;
    if (!this._displayInterimResults) interimTranscript = '';
    // this is primarily used to remove padding when interim/final text is removed on command
    const isNoText = this.finalTranscript === '' && interimTranscript === '';
    if (this._primitiveElement) {
      this.updatePrimitiveElement(this._primitiveElement, interimTranscript, isNoText);
    } else if (this._genericElement) {
      this.updateGenericElement(this._genericElement, interimTranscript, isNoText);
    }
  }

  // prettier-ignore
  // remember that padding values here contain actual text left and right
  private updatePrimitiveElement(element: HTMLInputElement, interimTranscript: string, isNoText: boolean) {
    if (this.isHighlighted) Highlight.removeForPrimitive(this, element);
    if (!this.primitiveTextRecorded) Padding.adjustStateAfterRecodingPrimitiveElement(this, element);
    if (isNoText) Padding.adjustSateForNoTextPrimitiveElement(this);
    const cursorLeftSideText = this.startPadding + this.finalTranscript + interimTranscript;
    element.value = cursorLeftSideText + this.endPadding;
    if (!this.isTargetInShadow) {
      const newCusrorPos = cursorLeftSideText.length + this.numberOfSpacesAfterNewText;
      Cursor.setOffsetForPrimitive(element, newCusrorPos, this.autoScroll);      
    }
    if (this.autoScroll && Browser.IS_SAFARI() && this.isCursorAtEnd) AutoScroll.scrollSafariPrimitiveToEnd(element);
  }

  private updateGenericElement(element: HTMLElement, interimTranscript: string, isNoText: boolean) {
    if (this.isHighlighted) Highlight.removeForGeneric(this, element);
    if (!this.spansPopulated) Elements.appendSpans(this, element);
    // for web speech api - safari only returns final text - no interim
    const finalText = (isNoText ? '' : this.startPadding) + Text.lineBreak(this.finalTranscript);
    this.finalSpan.innerHTML = finalText;
    const isAutoScrollingRequired = AutoScroll.isRequired(this.autoScroll, element);
    AutoScroll.changeStateIfNeeded(this, isAutoScrollingRequired);
    const interimText = Text.lineBreak(interimTranscript) + (isNoText ? '' : this.endPadding);
    this.interimSpan.innerHTML = interimText;
    if (Browser.IS_SAFARI() && this.insertInCursorLocation) {
      Cursor.setOffsetForSafariGeneric(element, finalText.length + interimText.length);
    }
    if (isAutoScrollingRequired) AutoScroll.scrollGeneric(this, element);
    if (isNoText) this.scrollingSpan.innerHTML = '';
  }

  finalise(isDuringReset?: boolean) {
    if (this._genericElement) {
      if (isDuringReset) {
        this.finalSpan = Elements.createGenericSpan();
        this.setInterimColorToFinal();
        this.interimSpan = Elements.createInterimSpan();
        this.scrollingSpan = Elements.createGenericSpan();
      } else {
        this._genericElement.textContent = this._genericElement.textContent as string;
      }
      this.spansPopulated = false;
    }
    EventListeners.remove(this);
  }

  setInterimColorToFinal() {
    this.interimSpan.style.color = this._finalTextColor || 'black';
  }

  private resetState(isDuringReset?: boolean) {
    this._primitiveElement = undefined;
    this._genericElement = undefined;
    this.finalTranscript = '';
    this.finalSpan.innerHTML = '';
    this.interimSpan.innerHTML = '';
    this.scrollingSpan.innerHTML = '';
    this.startPadding = '';
    this.endPadding = '';
    this.isHighlighted = false;
    this.primitiveTextRecorded = false;
    this.numberOfSpacesBeforeNewText = 0;
    this.numberOfSpacesAfterNewText = 0;
    if (!isDuringReset) this.stopTimeout = undefined;
  }

  setStateOnStart() {
    this.recognizing = true;
    if (this.isRestarting) {
      // this is the only place where this.isRestarting needs to be set to false
      // as whn something goes wrong or the user is manually restarting - a new speech service will be initialized
      this.isRestarting = false;
    } else {
      this._onStart?.();
    }
  }

  setStateOnStop() {
    this.recognizing = false;
    if (!this.isRestarting) {
      this._onStop?.();
    }
  }

  setStateOnError(details: string) {
    this._onError?.(details);
    this.recognizing = false;
  }

  abstract start(options?: Options, isDuringReset?: boolean): void;

  abstract stop(isDuringReset?: boolean): void;
}
