import {toggleAzure, toggleWebSpeech} from '../utils/functionality/toggleSpeech';
import {changeService} from '../utils/functionality/changeService';
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

export default function IndexPage() {
  const [availableServices, setAvailableServices] = React.useState<{value: string; text: string}[]>([]);
  const [activeService, setActiveService] = React.useState('webspeech');
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const textElement = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    // WORK - add link for more examples
    if (!window.SpeechSDK) {
      window.SpeechSDK = sdk;
    }
    const availableServicesArr: {value: string; text: string}[] = [{value: 'azure', text: 'Azure Speech'}];
    if (SpeechToElement.isWebSpeechSupported()) availableServicesArr.unshift({value: 'webspeech', text: 'Web Speech'});
    setAvailableServices(availableServicesArr);
  }, []);
  return (
    <>
      <main id={styles.main}>
        <h1 id={styles.title}>Speech To Element Demo</h1>
        <div id={styles.text} ref={textElement} contentEditable={true}></div>
        <div
          id={styles.button}
          onClick={() => {
            if (activeService === 'webspeech') {
              toggleWebSpeech(textElement, setIsRecording, setIsPreparing, setIsError);
            } else if (activeService === 'azure') {
              toggleAzure(textElement, setIsRecording, setIsPreparing, setIsError);
            }
            if (!isRecording) setIsPreparing(true);
          }}
        >
          <Microphone isRecording={isRecording}></Microphone>
          {isPreparing ? (
            <div>Connecting...</div>
          ) : isError ? (
            <div id={styles.messageError}>Error, please check the console for more info</div>
          ) : (
            <div id={styles.messageEmpty}>Placeholder text</div>
          )}
        </div>
        <select
          id={styles.dropdown}
          value={activeService}
          onChange={(event) => {
            changeService(isRecording, isPreparing);
            setActiveService(event.target.value);
          }}
        >
          {availableServices.map((service) => (
            <option key={service.value} value={service.value}>
              {service.text}
            </option>
          ))}
        </select>
        {activeService === 'azure' && (
          <div id={styles.subscriptionKeyTip}>Make sure to set the SUBSCRIPTION_KEY and REGION environment variables</div>
        )}
      </main>
    </>
  );
}
