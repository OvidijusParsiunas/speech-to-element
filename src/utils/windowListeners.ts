import {Options} from '../types/options';
import {Speech} from '../speech';

export class WindowListeners {
  private static mouseDownWindow(this: Speech, targetElement: HTMLElement, event: MouseEvent) {
    this.mouseDownElement = event.target === targetElement ? targetElement : undefined;
  }

  private static mouseUpWindow(this: Speech, options: Options | undefined) {
    if (this.mouseDownElement) {
      this.resetRecording(options);
    }
    this.mouseDownElement = undefined;
  }

  public static add(speech: Speech, options: Options) {
    if (options.element) {
      speech.mouseDownEvent = WindowListeners.mouseDownWindow.bind(speech, options.element);
      document.addEventListener('mousedown', speech.mouseDownEvent);
    }
    speech.mouseUpEvent = WindowListeners.mouseUpWindow.bind(speech, options);
    document.addEventListener('mouseup', speech.mouseUpEvent);
  }

  public static remove(speech: Speech) {
    document.removeEventListener('mousedown', speech.mouseDownEvent as EventListener);
    document.removeEventListener('mouseup', speech.mouseUpEvent as EventListener);
  }
}
