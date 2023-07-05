import {Speech} from '../speech';

export class StopTimeout {
  private static set(speech: Speech) {
    speech.stopTimeout = setTimeout(() => speech.stop(), speech.stopTimeoutMS);
  }

  public static reset(speech: Speech, stopTimeoutMS?: number) {
    if (!stopTimeoutMS) return;
    speech.stopTimeoutMS = stopTimeoutMS;
    if (speech.stopTimeout) clearTimeout(speech.stopTimeout);
    StopTimeout.set(speech);
  }
}
