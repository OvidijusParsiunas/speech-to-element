export type ExtractFunc = (
  event: SpeechRecognitionEvent,
  finalTranscript: string
) => {interimTranscript: string; finalTranscript: string};

export class WebSpeechAPITranscript {
  public static extract(event: SpeechRecognitionEvent, finalTranscript: string) {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    return {interimTranscript, finalTranscript};
  }

  public static extractSafari(event: SpeechRecognitionEvent) {
    let finalTranscript = '';
    const interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      finalTranscript += event.results[i][0].transcript;
    }
    return {interimTranscript, finalTranscript};
  }
}
