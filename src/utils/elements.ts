import {TextColor} from '../types/options';
import {Speech} from '../speech';

export class Elements {
  public static isPrimitiveElement(element: HTMLElement) {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
  }

  public static createInterimSpan() {
    const span = document.createElement('span');
    span.style.color = 'grey';
    span.style.pointerEvents = 'none';
    return span;
  }

  public static createFinalSpan() {
    const span = document.createElement('span');
    span.style.pointerEvents = 'none';
    return span;
  }

  public static appendSpans(speech: Speech, element: HTMLElement) {
    speech.spansPopulated = true;
    if (speech.insertInCursorLocation && document.activeElement === element) {
      const selection = window.getSelection();
      if (selection?.focusNode) {
        const newRange = selection.getRangeAt(0);
        newRange.insertNode(speech.interimSpan);
        newRange.insertNode(speech.finalSpan);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
        return;
      }
    }
    element.appendChild(speech.finalSpan);
    element.appendChild(speech.interimSpan);
  }

  public static applyCustomColors(speech: Speech, color: TextColor) {
    if (color.interim) speech.interimSpan.style.color = color.interim;
    if (color.final) speech.finalSpan.style.color = color.final;
  }
}
