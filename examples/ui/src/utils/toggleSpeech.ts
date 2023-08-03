import SpeechToElement from 'speech-to-element';

export function toggleWebSpeech(
  element: React.RefObject<HTMLElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setIsError: (state: boolean) => void
) {
  setIsError(false);
  SpeechToElement.toggle('webspeech', {
    element: element.current as HTMLElement,
    onStart: () => {
      setIsRecording(true);
      setIsPreparing(false);
    },
    onStop: () => {
      setIsRecording(false);
      setIsPreparing(false);
    },
    onError: () => {
      setIsError(true);
      setIsPreparing(false);
    },
  });
}

export function toggleAzure(
  element: React.RefObject<HTMLElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setIsError: (state: boolean) => void
) {
  setIsError(false);
  SpeechToElement.toggle('azure', {
    element: element.current as HTMLElement,
    // !!!!!!!!!!!!!!!!!!! The region must be set here !!!!!!!!!!!!!!!!!!!!!!!!
    region: 'eastus',
    // Fetch a new token from the edge function (located in the api/token.ts file)
    retrieveToken: async () => {
      return fetch('http://localhost:8080/token')
        .then((res) => res.text())
        .then((token) => token);
    },
    onStart: () => {
      setIsRecording(true);
      setIsPreparing(false);
    },
    onStop: () => {
      setIsRecording(false);
      setIsPreparing(false);
    },
    onError: () => {
      setIsError(true);
      setIsPreparing(false);
    },
  });
}
