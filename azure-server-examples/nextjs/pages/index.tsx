import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import Microphone from '../components/microphone';
import SpeechToElement from 'speech-to-element';
import styles from '../styles/main.module.css';
import React from 'react';

declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}

function buttonClick(
  element: React.MutableRefObject<HTMLInputElement>,
  setIsRecording: (state: boolean) => void,
  setIsPreparing: (state: boolean) => void,
  setIsError: (state: boolean) => void
) {
  setIsError(false);
  SpeechToElement.toggle('azure', {
    element: element.current,
    region: 'eastus',
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

export default function IndexPage() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const element = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    // WORK - add link for more examples
    if (!window.SpeechSDK) {
      window.SpeechSDK = sdk;
    }
  }, []);
  return (
    <>
      <main id={styles.main}>
        <div>
          <h1 id={styles.title}>Speech To Element via Azure Demo</h1>
          <div>
            <div id={styles.text} ref={element} contentEditable={true}></div>
            <div
              id={styles.button}
              onClick={() => {
                buttonClick(element, setIsRecording, setIsPreparing, setIsError);
                if (!isRecording) setIsPreparing(true);
              }}
            >
              <Microphone isRecording={isRecording}></Microphone>
              {isPreparing ? (
                <div>Preparing</div>
              ) : isError ? (
                <div style={{color: 'red'}}>Error, please check the console for more info</div>
              ) : (
                <div style={{opacity: 0}}>Placeholder text</div>
              )}
            </div>
          </div>
          <div style={{marginTop: 30, color: 'grey'}}>Make sure to set the SUBSCRIPTION_KEY environment variable</div>
        </div>
      </main>
    </>
  );
}
