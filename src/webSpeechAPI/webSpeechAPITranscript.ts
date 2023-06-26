export class WebSpeechAPITranscript {
  public static get(event: SpeechRecognitionEvent) {
    let interimTranscript = '';
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    return {interimTranscript, finalTranscript};
  }
}
