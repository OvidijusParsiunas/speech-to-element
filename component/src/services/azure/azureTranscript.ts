import {Translations} from '../../types/options';
import {Translate} from '../../utils/translate';

export class AzureTranscript {
  // newText is used to only send new text in onResult as finalTranscript is continuously accumulated
  public static extract(text: string, finalTranscript: string, isFinal: boolean, translations?: Translations) {
    if (translations) text = Translate.translate(text, translations);
    if (isFinal) {
      return {interimTranscript: '', finalTranscript: finalTranscript + text, newText: text};
    }
    return {interimTranscript: text, finalTranscript, newText: text};
  }
}
