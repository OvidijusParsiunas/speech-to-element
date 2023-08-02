import SpeechToElement from 'speech-to-element';

export function toggleWebSpeech(
  element: React.MutableRefObject<HTMLInputElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setIsError: (state: boolean) => void
) {
  setIsError(false);
  SpeechToElement.toggle('webspeech', {
    element: element.current,
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
  element: React.MutableRefObject<HTMLInputElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setIsError: (state: boolean) => void
) {
  setIsError(false);
  SpeechToElement.toggle('azure', {
    element: element.current,
    region: process.env.REGION,
    // Fetch a new token from the edge function (located in the api/token.ts file)
    retrieveToken: async () => {
      return fetch('api/token')
        .then((res) => res.text())
        .then((data) => {
          return data;
        });
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
