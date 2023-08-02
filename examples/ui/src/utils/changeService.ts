import SpeechToElement from 'speech-to-element';

export function changeService(isRecording: boolean, isPreparing: boolean, setIsError: (state: boolean) => void) {
  setIsError(false);
  if (isRecording) {
    SpeechToElement.stop();
  } else if (isPreparing) {
    setTimeout(SpeechToElement.stop, 10);
  }
}
