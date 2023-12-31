import {Elements} from './elements';
import {Speech} from '../speech';
import {Cursor} from './cursor';

export class Highlight {
  private static setStateForPrimitive(speech: Speech, element: HTMLInputElement) {
    let startIndex;
    let endIndex;
    if (element.selectionStart !== null) startIndex = element.selectionStart;
    if (element.selectionEnd !== null) endIndex = element.selectionEnd;
    speech.isHighlighted = startIndex !== endIndex;
  }

  private static setStateForGeneric(speech: Speech, element: HTMLElement) {
    const selection = window.getSelection();
    if (selection?.focusNode) {
      const startIndex = Cursor.getGenericElementCursorOffset(element, selection, true);
      const endIndex = Cursor.getGenericElementCursorOffset(element, selection, false);
      speech.isHighlighted = startIndex !== endIndex;
    }
  }

  public static setState(speech: Speech, element: HTMLElement) {
    if (document.activeElement === element) {
      if (Elements.isPrimitiveElement(element)) {
        Highlight.setStateForPrimitive(speech, element as HTMLInputElement);
      } else {
        Highlight.setStateForGeneric(speech, element);
      }
    }
  }

  public static removeForGeneric(speech: Speech, element: HTMLElement) {
    const selection = window.getSelection();
    if (selection) {
      const startOffset = Cursor.getGenericElementCursorOffset(element, selection, true);
      selection.deleteFromDocument();
      Cursor.setOffsetForGeneric(element, startOffset);
      speech.isHighlighted = false;
    }
  }

  public static removeForPrimitive(speech: Speech, element: HTMLInputElement) {
    const selectionStart = element.selectionStart;
    const selectionEnd = element.selectionEnd;
    const currentValue = element.value;
    if (selectionStart && selectionEnd) {
      const newValue = currentValue.substring(0, selectionStart) + currentValue.substring(selectionEnd);
      element.value = newValue;
      Cursor.setOffsetForPrimitive(element, selectionStart, speech.autoScroll);
    }
    speech.isHighlighted = false;
  }
}
