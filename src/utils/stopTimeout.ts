import {Speech} from '../speech';

export class StopTimeout {
  public static reset(speech: Speech, stopTimeoutMS?: number) {
    if (!stopTimeoutMS) return;
    speech.stopTimeoutMS = stopTimeoutMS;
    if (speech.stopTimeout) clearTimeout(speech.stopTimeout);
    speech.stopTimeout = setTimeout(() => {
      speech.stop();
    }, speech.stopTimeoutMS);
  }
}
