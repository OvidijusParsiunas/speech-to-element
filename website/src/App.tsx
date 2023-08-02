import {toggleAzure, toggleWebSpeech} from './utils/toggleSpeech';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import {validateAzure} from './utils/validateAzureOptions';
import AzureOptions from './components/AzureOptions';
import {changeService} from './utils/changeService';
import Microphone from './components/Microphone';
import SpeechToElement from 'speech-to-element';
import Header from './components/header/Header';
import React from 'react';
import './App.css';

declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}

// WORK - enhance website to add toggles for more options and display what the API would look like
function App() {
  const [availableServices, setAvailableServices] = React.useState<{value: string; text: string}[]>([]);
  const [activeAzureOption, setActiveAzureOption] = React.useState('subscription');
  const [azureCredentials, setAzureCredentials] = React.useState('');
  const [activeAzureRegion, setActiveAzureRegion] = React.useState('');
  const [activeService, setActiveService] = React.useState('webspeech');
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreparing, setIsPreparing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const textElement = React.useRef(null);
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
      <Header />
      <main id="main">
        <h1 id="title">Speech To Element</h1>
        <div id="text" ref={textElement} contentEditable={true}></div>
        <div
          id="button"
          onClick={() => {
            if (activeService === 'webspeech') {
              toggleWebSpeech(textElement, setIsRecording, setIsPreparing, setErrorMessage);
            } else if (activeService === 'azure') {
              const errorMessage = validateAzure(activeAzureOption, activeAzureRegion, azureCredentials);
              if (errorMessage) {
                console.error(errorMessage);
                return setErrorMessage(errorMessage);
              } else {
                toggleAzure(
                  textElement,
                  setIsRecording,
                  setIsPreparing,
                  setErrorMessage,
                  activeAzureOption,
                  activeAzureRegion,
                  azureCredentials
                );
              }
            }
            if (!isRecording) setIsPreparing(true);
          }}
        >
          <Microphone isRecording={isRecording}></Microphone>
        </div>
        <div>
          {isPreparing ? (
            <div>Connecting...</div>
          ) : errorMessage ? (
            <div id="message-error">{errorMessage}</div>
          ) : (
            <div id="message-empty">Placeholder text</div>
          )}
        </div>
        <select
          id="service-dropdown"
          className={'dropdown'}
          value={activeService}
          onChange={(event) => {
            changeService(isRecording, isPreparing, setErrorMessage);
            setActiveService(event.target.value);
          }}
        >
          {availableServices.map((service) => (
            <option key={service.value} value={service.value}>
              {service.text}
            </option>
          ))}
        </select>
        {activeService === 'azure' &&
          AzureOptions(
            activeAzureOption,
            setActiveAzureOption,
            activeAzureRegion,
            setActiveAzureRegion,
            azureCredentials,
            setAzureCredentials
          )}
      </main>
    </>
  );
}

export default App;
