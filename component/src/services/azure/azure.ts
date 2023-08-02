import {Recognizer, SpeechRecognitionEventArgs} from 'microsoft-cognitiveservices-speech-sdk';
import {AzureOptions, Options, Translations} from '../../types/options';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import {AzureSpeechConfig} from './azureSpeechConfig';
import {AzureTranscript} from './azureTranscript';
import {Speech} from '../../speech';

declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}

export class Azure extends Speech {
  // when service is manually stopped events are still fired, this is used to stop more text being added
  private _stopping?: boolean;
  private _service?: sdk.SpeechRecognizer;
  private _translations?: Translations;
  private _retrieveTokenInterval?: NodeJS.Timeout;

  start(options: Options & AzureOptions) {
    this.startAsync(options);
  }

  private async startAsync(options: Options & AzureOptions) {
    // need to prepare before validation to set onError
    this.prepareBeforeStart(options);
    if (this.validate(options)) {
      await this.instantiateService(options);
      this._translations = options?.translations;
      this._service?.startContinuousRecognitionAsync(() => {}, this.error);
    }
  }

  private validate(options: Options & AzureOptions) {
    if (!Azure.getAPI()) {
      this.moduleNotFound();
      return false;
    }
    return AzureSpeechConfig.validateOptions(this.error.bind(this), options);
  }

  private async instantiateService(options: Options & AzureOptions) {
    const speechSDK = Azure.getAPI();
    const audioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = await AzureSpeechConfig.get(speechSDK.SpeechConfig, options);
    if (speechConfig) {
      const recognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
      this.setEvents(recognizer);
      this._service = recognizer;
      if (options.retrieveToken) this.retrieveTokenInterval(options.retrieveToken);
    }
  }

  private setEvents(recognizer: sdk.SpeechRecognizer) {
    recognizer.recognizing = this.onRecognizing.bind(this);
    recognizer.recognized = this.onRecognized.bind(this);
    recognizer.sessionStarted = this.onSessionStarted.bind(this);
    recognizer.canceled = this.onCanceled.bind(this);
    recognizer.sessionStopped = this.onSessionStopped.bind(this);

    // PhraseListGrammar allows for the customization of recognizer vocabulary.
    // The semicolon-delimited list of words or phrases will be treated as additional, more likely components
    // of recognition results when applied to the recognizer.
    //
    // See https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started-speech-to-text#improve-recognition-accuracy
    // if (phrases.value) {
    //   const phraseListGrammar = sdk.PhraseListGrammar.fromRecognizer(recognizer);
    //   phraseListGrammar.addPhrases(phrases.value.split(';'));
    // }
  }

  // prettier-ignore
  private onRecognizing(_: Recognizer, event: SpeechRecognitionEventArgs) {
    if (this._stopping) return;
    const {interimTranscript, finalTranscript, newText} = AzureTranscript.extract(
      event.result.text, this.finalTranscript, false, this._translations);
    this.updateElements(interimTranscript, finalTranscript, newText);
  }

  //   function onRecognized(sender, recognitionEventArgs) {
  //     var result = recognitionEventArgs.result;
  //     onRecognizedResult(recognitionEventArgs.result);
  // }

  // prettier-ignore
  private onRecognized(_: Recognizer, event: SpeechRecognitionEventArgs) {
    const result = event.result;
    switch (result.reason) {
      case window.SpeechSDK.ResultReason.Canceled:
        break;
      case window.SpeechSDK.ResultReason.RecognizedSpeech:
        if (result.text && !this._stopping) {
          const {interimTranscript, finalTranscript, newText} = AzureTranscript.extract(
            result.text, this.finalTranscript, true, this._translations);
          this.updateElements(interimTranscript, finalTranscript, newText);
        }
        break;
    }
  }

  private onCanceled(_: Recognizer, event: sdk.SpeechRecognitionCanceledEventArgs) {
    if (event.reason === window.SpeechSDK.CancellationReason.Error) {
      this.error(event.errorDetails);
    }
  }

  private onSessionStarted() {
    this.setStateOnStart();
  }

  private onSessionStopped() {
    if (!this._retrieveTokenInterval) clearInterval(this._retrieveTokenInterval);
    this._stopping = false;
    this.setStateOnStop();
  }

  private retrieveTokenInterval(retrieveToken: AzureOptions['retrieveToken']) {
    this._retrieveTokenInterval = setInterval(() => {
      retrieveToken?.()
        .then((token) => {
          if (this._service) this._service.authorizationToken = token;
        })
        .catch((error) => {
          this.error(error);
        });
    }, 10000);
  }

  stop(isDuringReset?: boolean) {
    if (!isDuringReset && this._retrieveTokenInterval) clearInterval(this._retrieveTokenInterval);
    this._stopping = true;
    this._service?.stopContinuousRecognitionAsync();
    this.finalise(isDuringReset);
  }

  static getAPI(): typeof sdk {
    return window.SpeechSDK;
  }

  private moduleNotFound() {
    console.error('speech recognition module not found:');
    console.error(
      "please install the 'microsoft-cognitiveservices-speech-sdk' npm package " +
        'or add a script tag: <script src="https://aka.ms/csspeech/jsbrowserpackageraw"></script>'
    );
    this.setStateOnError('speech recognition module not found');
  }

  private error(details: string) {
    if (this._retrieveTokenInterval) clearInterval(this._retrieveTokenInterval);
    console.error(details);
    this.setStateOnError(details);
  }
}