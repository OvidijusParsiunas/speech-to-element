import {OnPreResult, Options} from '../types/options';
import {Speech} from '../speech';

export class PreResultUtils {
  public static process(speech: Speech, newText: string, isFinal: boolean, onPreResult: OnPreResult, options?: Options) {
    const result = onPreResult(newText, isFinal);
    if (!result) return true;
    // this is to prevent the spans from being repopulated after service stopped
    setTimeout(() => {
      if (result.restart) {
        speech.resetRecording(options);
      } else if (result.stop) {
        speech.stop();
      }
    });
    return result.displayText === undefined || result.displayText;
  }
}
