import {Speech} from '../speech';

// Strategy:

// This is only used for generic elements

// Originally used element.scrollIntoView(false) - however it was scrolling the entire screen
// scrollIntoView({block: 'nearest'}) worked - but if the span covers multiple lines the scroll won't go down to new text

// Scrolling is facilitated by adding a scrollingSpan element after the interimSpan that acts like padding and
// we scroll to it
// When the cursor is at end (isCursorAtEnd) - we don't need scrollingSpan and simply force scroll to bottom
// scrollingSpan is ultimately only used when auto scrolling is required and cursor is not at end:
// one accepted behavioural caviat is that text will always have right padding - due to &nbsp;
export class AutoScroll {
  public static changeStateIfNeeded(speech: Speech, isAutoScrollingRequired: boolean) {
    if (isAutoScrollingRequired && !speech.isCursorAtEnd) {
      speech.endPadding = '';
      // to scroll to span - it needs to have text (' ' does not work in spans), hence &nbsp; is a placeholder space
      speech.scrollingSpan.innerHTML = '&nbsp;';
    }
  }

  public static scrollGeneric(speech: Speech, element: HTMLElement) {
    if (speech.isCursorAtEnd) {
      element.scrollTop = element.scrollHeight;
    } else {
      speech.scrollingSpan.scrollIntoView({block: 'nearest'});
    }
  }

  // primitives don't need to be scrolled except in safari
  // they can only safely be scrolled to the end
  public static scrollSafariPrimitiveToEnd(element: HTMLElement) {
    element.scrollLeft = element.scrollWidth;
    element.scrollTop = element.scrollHeight;
  }

  private static isElementOverflown(element: HTMLElement) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

  public static isRequired(autoScroll: boolean, element: HTMLElement) {
    return autoScroll && AutoScroll.isElementOverflown(element);
  }
}
