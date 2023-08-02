import SpeechToElement from 'speech-to-element';

export function changeService(isRecording: boolean, isPreparing: boolean, setErrorMessage: (message: string) => void) {
  setErrorMessage('');
  if (isRecording) {
    SpeechToElement.stop();
  } else if (isPreparing) {
    setTimeout(SpeechToElement.stop, 10);
  }
}
