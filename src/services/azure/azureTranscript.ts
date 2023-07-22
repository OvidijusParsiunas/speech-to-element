import {Translations} from '../../types/options';
import {Translate} from '../../utils/translate';

export class AzureTranscript {
  public static extract(text: string, finalTranscript: string, isFinal: boolean, translations?: Translations) {
    if (translations) text = Translate.translate(text, translations);
    if (isFinal) {
      return {interimTranscript: '', finalTranscript: `${finalTranscript + text} `};
    }
    return {interimTranscript: text, finalTranscript};
  }
}
