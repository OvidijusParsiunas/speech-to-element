import {OnResult} from '../types/options';

export class Callbacks {
  public static update(interimTranscript: string, finalTranscript: string, onResult: OnResult) {
    if (interimTranscript !== '') {
      onResult?.(interimTranscript, false);
    } else if (finalTranscript !== '') {
      onResult?.(finalTranscript, true);
    }
  }
}
