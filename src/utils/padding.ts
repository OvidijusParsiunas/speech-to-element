import {Elements} from './elements';
import {Speech} from '../speech';
import {Cursor} from './cursor';
import {Text} from './text';

export class Padding {
  private static setStateForPrimitiveElement(speech: Speech, element: HTMLInputElement) {
    if (document.activeElement === element && element.selectionStart !== null) {
      const startIndex = element.selectionStart;
      const leftCharacter = element.value[startIndex - 1];
      const endIndex = element.selectionEnd === null ? startIndex : element.selectionEnd;
      const rightCharacter = element.value[endIndex];
      if (Text.isCharDefined(leftCharacter)) speech.startPadding = ' ';
      if (Text.isCharDefined(rightCharacter)) {
        speech.endPadding = ' ';
        speech.numberOfSpacesAfterNewText = 1;
      }
      return;
    }
    const lastCharacter = element.value[element.value.length - 1];
    if (Text.isCharDefined(lastCharacter)) speech.startPadding = ' ';
  }

  private static setStateForGenericElement(speech: Speech, element: HTMLElement) {
    if (document.activeElement === element) {
      const selection = window.getSelection();
      if (selection?.focusNode) {
        const startIndex = Cursor.getGenericElementCursorOffset(element, selection, true);
        const leftCharacter = element.textContent?.[startIndex - 1];
        const endIndex = Cursor.getGenericElementCursorOffset(element, selection, false);
        const rightCharacter = element.textContent?.[endIndex];
        if (Text.isCharDefined(leftCharacter)) speech.startPadding = ' ';
        if (Text.isCharDefined(rightCharacter)) speech.endPadding = ' ';
        return;
      }
    }
    const lastCharacter = element.innerText.charAt(element.innerText.length - 1);
    if (Text.isCharDefined(lastCharacter)) speech.startPadding = ' ';
  }

  public static setState(speech: Speech, element: HTMLElement) {
    if (Elements.isPrimitiveElement(element)) {
      Padding.setStateForPrimitiveElement(speech, element as HTMLInputElement);
    } else {
      Padding.setStateForGenericElement(speech, element);
    }
  }

  public static adjustStateForPrimitiveElement(speech: Speech, input: HTMLInputElement) {
    speech.primitiveTextRecorded = true;
    if (speech.insertInCursorLocation && document.activeElement === input) {
      if (input.selectionEnd !== null) {
        speech.endPadding = speech.endPadding + input.value.slice(input.selectionEnd);
      }
      if (input.selectionStart !== null) {
        speech.startPadding = input.value.slice(0, input.selectionStart) + speech.startPadding;
        return;
      }
    }
    // this needs to be set to not retain the existing text
    speech.startPadding = input.value + speech.startPadding;
  }
}
