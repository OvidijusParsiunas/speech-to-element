import {Speech} from '../speech';

export class GlobalState {
  public static service: Speech | undefined;
  private static doubleClickPending = false;

  public static doubleClickDetector() {
    if (GlobalState.doubleClickPending) return true;
    GlobalState.doubleClickPending = true;
    setTimeout(() => {
      GlobalState.doubleClickPending = false;
    }, 300);
    return false;
  }
}
