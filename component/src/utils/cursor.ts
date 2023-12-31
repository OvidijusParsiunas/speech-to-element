export class Cursor {
  public static setOffsetForGeneric(element: HTMLElement, offset: number, countedText = 0) {
    let countedTextInElement = 0;
    for (let i = 0; i < element.childNodes.length; i += 1) {
      const node = element.childNodes[i];
      if (node.childNodes.length > 0) {
        const result = Cursor.setOffsetForGeneric(node as HTMLElement, offset, countedText);
        if (result === -1) return -1;
        countedText += result;
      } else if (node.textContent !== null) {
        if (countedText + node.textContent.length > offset) {
          const range = document.createRange();
          range.setStart(node, offset - countedText);
          range.collapse(true);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          element.focus();
          return -1;
        }
        countedText += node.textContent.length;
        countedTextInElement += node.textContent.length;
      }
    }
    return countedTextInElement;
  }

  public static focusEndOfGeneric(element: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  public static setOffsetForSafariGeneric(element: HTMLElement, newTextLength: number) {
    const selection = window.getSelection();
    if (selection) {
      // if refactoring this - take care of overflow
      const cursorOffset = Cursor.getGenericElementCursorOffset(element, selection, true);
      Cursor.setOffsetForGeneric(element, cursorOffset + newTextLength);
    }
  }

  // set to automatically scroll to cursor (scroll does not work in Safari)
  public static setOffsetForPrimitive(element: HTMLInputElement, offset: number, scroll: boolean) {
    if (scroll) element.blur();
    element.setSelectionRange(offset, offset);
    element.focus();
  }

  // Scroll Input in Safari - does not work for TextArea and uses span which can have a different style
  // private static getCursorOffsetFromLeft(inputElement: HTMLInputElement, position: number) {
  //   // Get the value of the input element up to the cursor position
  //   const valueUpToCursor = inputElement.value.substring(0, position);

  //   // Create a temporary span element to measure the width of the text
  //   const tempSpan = document.createElement('span');
  //   tempSpan.textContent = valueUpToCursor;
  //   tempSpan.style.visibility = 'hidden';
  //   tempSpan.style.position = 'absolute';
  //   document.body.appendChild(tempSpan);

  //   // Measure the width of the text up to the cursor position
  //   const offsetWidth = tempSpan.offsetWidth;
  //   const offsetHeight = tempSpan.offsetHeight;

  //   // Clean up the temporary span element
  //   document.body.removeChild(tempSpan);

  //   return {left: offsetWidth, top: offsetHeight};
  // }

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
