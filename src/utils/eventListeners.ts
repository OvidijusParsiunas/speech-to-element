import {Options} from '../types/options';
import {Speech} from '../speech';

export class EventListeners {
  private static KEY_DOWN_TIMEOUT: number | null = null;

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
    const insertOnMouseDown = options.insertOnMouseDown === undefined || options.insertOnMouseDown;
    const insertOnKeyDown = options.insertOnKeyDown === undefined || options.insertOnKeyDown;
    if (options.element) {
      if (insertOnMouseDown) {
        speech.mouseDownEvent = EventListeners.mouseDownWindow.bind(speech, options.element);
        document.addEventListener('mousedown', speech.mouseDownEvent);
      }
      if (insertOnKeyDown) {
        speech.keyDownEvent = EventListeners.keyDownElement.bind(speech, options);
        options.element.addEventListener('keydown', speech.keyDownEvent);
      }
    }
    if (insertOnMouseDown) {
      speech.mouseUpEvent = EventListeners.mouseUpWindow.bind(speech, options);
      document.addEventListener('mouseup', speech.mouseUpEvent);
    }
  }

  public static remove(speech: Speech, element?: HTMLElement) {
    document.removeEventListener('mousedown', speech.mouseDownEvent as EventListener);
    document.removeEventListener('mouseup', speech.mouseUpEvent as EventListener);
    if (element && speech.keyDownEvent) element.removeEventListener('keydown', speech.keyDownEvent as EventListener);
  }

  private static keyDownElement(this: Speech, options: Options) {
    if (EventListeners.KEY_DOWN_TIMEOUT !== null) clearTimeout(EventListeners.KEY_DOWN_TIMEOUT);
    EventListeners.KEY_DOWN_TIMEOUT = setTimeout(() => {
      EventListeners.KEY_DOWN_TIMEOUT = null;
      this.resetRecording(options);
    }, 500); // this is used to prevent having to reset for every key down
  }
}
