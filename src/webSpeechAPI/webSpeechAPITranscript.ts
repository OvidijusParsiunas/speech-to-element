import {OnResult} from '../types/options';

export type ExtractFunc = (
  event: SpeechRecognitionEvent,
  finalTranscript: string,
  onResult?: OnResult
) => {interimTranscript: string; finalTranscript: string};

export class WebSpeechAPITranscript {
  private static update(interimTranscript: string, finalTranscript: string, onResult: OnResult) {
    if (interimTranscript !== '') {
      onResult?.(interimTranscript, false);
    } else if (finalTranscript !== '') {
      onResult?.(finalTranscript, false);
    }
  }

  public static extract(event: SpeechRecognitionEvent, finalTranscript: string, onResult?: OnResult) {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    if (onResult) WebSpeechAPITranscript.update(interimTranscript, finalTranscript, onResult);
    return {interimTranscript, finalTranscript};
  }

  public static extractSafari(event: SpeechRecognitionEvent, _: string, onResult?: OnResult) {
    let finalTranscript = '';
    const interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      finalTranscript += event.results[i][0].transcript;
    }
    if (onResult) WebSpeechAPITranscript.update(interimTranscript, finalTranscript, onResult);
    return {interimTranscript, finalTranscript};
  }
}
