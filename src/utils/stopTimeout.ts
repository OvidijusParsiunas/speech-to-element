import {Speech} from '../speech';

export class StopTimeout {
  private static readonly DEFAULT_MS = 20000; // 20s

  private static set(speech: Speech) {
    speech.stopTimeout = setTimeout(() => speech.stop(), speech.stopTimeoutMS);
  }

  public static reset(speech: Speech, stopTimeoutMS?: number) {
    speech.stopTimeoutMS = stopTimeoutMS || StopTimeout.DEFAULT_MS;
    if (speech.stopTimeout) clearTimeout(speech.stopTimeout);
    StopTimeout.set(speech);
  }
}
