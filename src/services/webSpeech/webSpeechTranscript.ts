import {Translations} from '../../types/options';
import {Translate} from '../../utils/translate';

export type ExtractFunc = (
  event: SpeechRecognitionEvent,
  finalTranscript: string,
  translations?: Translations
  // newText is used to only send new text in onResult as finalTranscript is continuously accumulated
) => {interimTranscript: string; finalTranscript: string; newText: string};

export class WebSpeechTranscript {
  public static extract(event: SpeechRecognitionEvent, finalTranscript: string, translations?: Translations) {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let newText = event.results[i][0].transcript;
      if (translations) newText = Translate.translate(newText, translations);
      if (event.results[i].isFinal) {
        finalTranscript += newText;
      } else {
        interimTranscript += newText;
      }
    }
    return {interimTranscript, finalTranscript, newText: interimTranscript || finalTranscript};
  }

  public static extractSafari(event: SpeechRecognitionEvent, _: string, translations?: Translations) {
    let finalTranscript = '';
    const interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let newText = event.results[i][0].transcript;
      if (translations) newText = Translate.translate(newText, translations);
      finalTranscript += newText;
    }
    return {interimTranscript, finalTranscript, newText: interimTranscript || finalTranscript};
  }
}
