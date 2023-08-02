import {AzureOptions} from 'speech-to-element/dist/types/options';
import SpeechToElement from 'speech-to-element';

export function toggleWebSpeech(
  element: React.RefObject<HTMLElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setErrorMessage: (message: string) => void
) {
  setErrorMessage('');
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
      setErrorMessage('Error, please check the console for more info');
      setIsPreparing(false);
    },
  });
}

export function toggleAzure(
  element: React.RefObject<HTMLElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setErrorMessage: (message: string) => void,
  option: string,
  region: string,
  credentials: string
) {
  setErrorMessage('');
  const azureOptions: AzureOptions = {region};
  if (option === 'subscription') {
    azureOptions.subscriptionKey = credentials;
  } else if (option === 'token') {
    azureOptions.token = credentials;
  } else if (option === 'retrieve') {
    // Fetch a new token from the edge function (located in the api/token.ts file)
    azureOptions.retrieveToken = async () => {
      return fetch('http://localhost:8080/token')
        .then((res) => res.text())
        .then((data) => {
          return data;
        })
        .catch(() => {
          // WORK - refactor the catch functions
          return '';
        });
    };
  }
  SpeechToElement.toggle('azure', {
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
      setErrorMessage('Error, please check the console for more info');
      setIsPreparing(false);
    },
    ...azureOptions,
  });
}
