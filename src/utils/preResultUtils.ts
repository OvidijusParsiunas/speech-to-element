import {OnPreResult, Options} from '../types/options';
import {Speech} from '../speech';

export class PreResultUtils {
  public static process(speech: Speech, newText: string, isFinal: boolean, onPreResult?: OnPreResult, options?: Options) {
    const result = onPreResult?.(newText, isFinal);
    if (!result) return false;
    // this is to prevent the spans from being repopulated after service stopped
    setTimeout(() => {
      if (result.restart) {
        speech.resetRecording(options);
      } else if (result.stop) {
        speech.stop();
      }
    });
    // removeNewText can only work reliably if stop or restart are used as otherwise the service will keep sending text
    return (result.stop || result.restart) && result.removeNewText;
  }
}
