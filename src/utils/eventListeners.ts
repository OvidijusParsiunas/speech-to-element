import {Options} from '../types/options';
import {Speech} from '../speech';

export class EventListeners {
  private static KEY_DOWN_TIMEOUT: NodeJS.Timeout | null = null;

  private static getElementIfFocusedOnAvailable(available: Element | Element[], focused: Element) {
    if (Array.isArray(available)) {
      return available.find((element) => focused === element);
    }
    return focused === available ? available : undefined;
  }

  private static keyDownWindow(this: Speech, options: Options) {
    if (!options.element) return;
    if (EventListeners.getElementIfFocusedOnAvailable(options.element, document.activeElement as Element)) {
      if (EventListeners.KEY_DOWN_TIMEOUT !== null) clearTimeout(EventListeners.KEY_DOWN_TIMEOUT);
      EventListeners.KEY_DOWN_TIMEOUT = setTimeout(() => {
        EventListeners.KEY_DOWN_TIMEOUT = null;
        this.resetRecording(options);
      }, 500); // this is used to prevent having to reset for every key down
    }
  }

  private static mouseDownWindow(this: Speech, available: Element | Element[], event: MouseEvent) {
    this.mouseDownElement = EventListeners.getElementIfFocusedOnAvailable(available, event.target as Element);
  }

  private static mouseUpWindow(this: Speech, options?: Options) {
    if (this.mouseDownElement) {
      this.resetRecording(options);
    }
    this.mouseDownElement = undefined;
  }

  public static add(speech: Speech, options?: Options) {
    const insertInNewLocation = options?.insertInCursorLocation === undefined || options?.insertInCursorLocation;
    if (options?.element && insertInNewLocation) {
      speech.mouseDownEvent = EventListeners.mouseDownWindow.bind(speech, options.element);
      document.addEventListener('mousedown', speech.mouseDownEvent);
      speech.mouseUpEvent = EventListeners.mouseUpWindow.bind(speech, options);
      document.addEventListener('mouseup', speech.mouseUpEvent);
      speech.keyDownEvent = EventListeners.keyDownWindow.bind(speech, options);
      document.addEventListener('keydown', speech.keyDownEvent);
    }
  }

  public static remove(speech: Speech) {
    document.removeEventListener('mousedown', speech.mouseDownEvent as EventListener);
    document.removeEventListener('mouseup', speech.mouseUpEvent as EventListener);
    document.removeEventListener('keydown', speech.keyDownEvent as EventListener);
  }
}
