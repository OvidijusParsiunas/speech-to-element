export class Cursor {
  public static setOffsetForGeneric(element: HTMLElement, offset: number, countedText = 0) {
    for (let i = 0; i < element.childNodes.length - 1; i += 1) {
      const node = element.childNodes[i];
      if (node.childNodes.length > 0) {
        const result = Cursor.setOffsetForGeneric(node as HTMLElement, offset, countedText);
        if (result === -1) return -1;
        countedText = result;
      } else {
        if (node.textContent !== null) {
          if (countedText + node.textContent.length > offset) {
            const range = document.createRange();
            range.setStart(node, offset - countedText);
            range.collapse(true);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            element.focus();
            return -1;
          } else {
            countedText += node.textContent.length;
          }
        }
      }
    }
    return countedText;
  }

  public static setOffsetForPrimitive(element: HTMLInputElement, offset: number) {
    element.setSelectionRange(offset, offset);
    element.focus();
  }

  public static getGenericElementCursorOffset(element: HTMLElement, selection: Selection, isStart: boolean) {
    let cursorOffset = 0;
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
      cursorOffset = allElementsRange.toString().length;
    }
    return cursorOffset;
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
