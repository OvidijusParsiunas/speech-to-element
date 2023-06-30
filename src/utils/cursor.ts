export class Cursor {
  public static setOffsetForGeneric(element: HTMLElement, offset: number) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(element.childNodes[0], offset);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
    element.focus();
  }

  public static setOffsetForPrimitive(element: HTMLInputElement, offset: number) {
    element.setSelectionRange(offset, offset);
    element.focus();
  }

  public static getGenericElementCursorPosition(element: HTMLElement, selection: Selection, isStart: boolean) {
    let cursorPosition = 0;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const allElementsRange = range.cloneRange();
      // get all of the text + span elements
      allElementsRange.selectNodeContents(element);
      // set range end to be the cursor
      if (isStart) {
        allElementsRange.setEnd(range.startContainer, range.startOffset);
      } else {
        allElementsRange.setEnd(range.endContainer, range.endOffset);
      }
      // get cursor relative to all elems
      cursorPosition = allElementsRange.toString().length;
    }
    return cursorPosition;
  }

  // for input
  // private static insertTextAtCursor(text: string, input: HTMLInputElement) {
  //   const startPos = input.selectionStart;
  //   const endPos = input.selectionEnd;
  //   if (startPos !== null && endPos !== null) {
  //     input.value = input.value.substring(0, startPos) + text + input.value.substring(endPos);
  //     input.selectionStart = input.selectionEnd = startPos + text.length;
  //   }
  // }
}
