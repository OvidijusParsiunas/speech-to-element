import {Recognizer, SpeechRecognitionEventArgs} from 'microsoft-cognitiveservices-speech-sdk';
import {AzureOptions, Options, Translations} from '../../types/options';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import {PreventConnectionStop} from './preventConnectionStop';
import {AzureSpeechConfig} from './azureSpeechConfig';
import {StopTimeout} from '../../utils/stopTimeout';
import {AzureTranscript} from './azureTranscript';
import {Speech} from '../../speech';

declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}

// REF - https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/browser/index.html#L240
export class Azure extends Speech {
  // when service is manually stopped events are still fired, this is used to stop more text being added
  private _stopping?: boolean;
  private _service?: sdk.SpeechRecognizer;
  private _translations?: Translations;
  private _retrieveTokenInterval?: NodeJS.Timeout;
  _manualConnectionStopPrevention?: NodeJS.Timeout;
  private _newTextPadding = ''; // Unlike webspeech there is no automatic space between final results

  start(options: Options & AzureOptions, isDuringReset?: boolean) {
    this._newTextPadding = '';
    if (this.stopTimeout === undefined) StopTimeout.reset(this, options?.stopAfterSilenceMs);
    this.prepareBeforeStart(options); // need to prepare before validation to set onError
    this.startAsync(options);
    if (!isDuringReset) PreventConnectionStop.applyPrevention(this);
  }

  private async startAsync(options: Options & AzureOptions) {
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
      let recognizer: sdk.SpeechRecognizer;
      if (options.autoLanguages && options.autoLanguages.length > 0) {
        const autoDetectLanguageConfig = speechSDK.AutoDetectSourceLanguageConfig.fromLanguages(
          options.autoLanguages
        );
        if(options.detectionType === "Continuous") {
            autoDetectLanguageConfig.mode = 1;
        }
        recognizer = speechSDK.SpeechRecognizer.FromConfig(
          speechConfig,
          autoDetectLanguageConfig,
          audioConfig
        );
      } else {
        recognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
      }
      this.setEvents(recognizer);
      this._service = recognizer;
      if (options.retrieveToken) this.retrieveTokenInterval(options.retrieveToken);
    } else {
      this.error('Unable to contact Azure server');
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
      this._newTextPadding + event.result.text, this.finalTranscript, false, this._translations);
    StopTimeout.reset(this, this.stopTimeoutMS);
    this.updateElements(interimTranscript, finalTranscript, newText);
  }

  // prettier-ignore
  private onRecognized(_: Recognizer, event: SpeechRecognitionEventArgs) {
    const result = event.result;
    switch (result.reason) {
      case window.SpeechSDK.ResultReason.Canceled:
        break;
      case window.SpeechSDK.ResultReason.RecognizedSpeech:
        if (result.text && !this._stopping) {
          const {interimTranscript, finalTranscript, newText} = AzureTranscript.extract(
            this._newTextPadding + result.text, this.finalTranscript, true, this._translations);
          StopTimeout.reset(this, this.stopTimeoutMS);
          this.updateElements(interimTranscript, finalTranscript, newText);
          if (finalTranscript !== '') this._newTextPadding = ' ';
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
    PreventConnectionStop.clearPrevention(this);
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
          if (this._service) this._service.authorizationToken = token?.trim() || '';
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
    this.stop();
  }
}
