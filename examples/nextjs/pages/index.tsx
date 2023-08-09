import {toggleAzure, toggleWebSpeech} from '../utils/functionality/toggleSpeech';
import {changeService} from '../utils/functionality/changeService';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import Microphone from '../components/microphone';
import SpeechToElement from 'speech-to-element';
import styles from '../styles/main.module.css';
import titleImage from '../assets/title.png';
import Image from 'next/image';
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
    // SpeechSDK can be defined in multiple ways, check out the following live code example:
    // https://stackblitz.com/edit/stackblitz-starters-ujkq7j?file=src%2FApp.tsx
    if (!window.SpeechSDK) window.SpeechSDK = sdk;
    const availableServicesArr: {value: string; text: string}[] = [{value: 'azure', text: 'Azure Speech'}];
    if (SpeechToElement.isWebSpeechSupported()) availableServicesArr.unshift({value: 'webspeech', text: 'Web Speech'});
    setAvailableServices(availableServicesArr);
  }, []);
  return (
    <>
      <main id={styles.main}>
        <Image id={styles.titleImage} src={titleImage} alt="Picture of the author" width={570} />
        <div id={styles.text} ref={textElement} contentEditable={true}></div>
        <div
          id={styles.button}
          onClick={() => {
            if (!isRecording) setIsPreparing(true);
            if (activeService === 'webspeech') {
              toggleWebSpeech(textElement, setIsRecording, setIsPreparing, setIsError);
            } else if (activeService === 'azure') {
              toggleAzure(textElement, setIsRecording, setIsPreparing, setIsError);
            }
          }}
        >
          <Microphone isRecording={isRecording}></Microphone>
        </div>
        <div>
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
            changeService(isRecording, isPreparing, setIsError);
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
