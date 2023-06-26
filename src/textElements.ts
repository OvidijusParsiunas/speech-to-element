export class TextElements {
  public static createInterimSpan() {
    const span = document.createElement('span');
    span.style.color = 'grey';
    return span;
  }

  public static createFinalSpan() {
    return document.createElement('span');
  }
}
