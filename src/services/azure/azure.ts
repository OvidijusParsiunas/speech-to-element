import {Recognizer, SpeechConfig, SpeechRecognitionEventArgs} from 'microsoft-cognitiveservices-speech-sdk';
import {OnError, Options, Translations, WebSpeechAPIOptions} from '../../types/options';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import {Speech} from '../../speech';

export class Azure extends Speech {
  private _service?: sdk.SpeechRecognizer;
  private _onError?: OnError;
  private readonly _translations?: Translations;

  constructor() {
    super();
  }

  start(options?: Options & WebSpeechAPIOptions) {
    console.log(sdk);
    this.prepareBeforeStart(options);
    this.instantiateService(options);
    this._onError = options?.onError;
    this._service?.startContinuousRecognitionAsync(() => {}, this.error);
    // this._translations = options?.translations;
  }

  private instantiateService(options?: Options & WebSpeechAPIOptions) {
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechConfig = Azure.getSpeechConfig(sdk.SpeechConfig);
    if (!speechConfig) return;

    const reco = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    this.setEvents(reco);
    this._service = reco;
    // const speechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    // if (!speechRecognition) {
    //   console.error('Speech Recognition is unsupported');
    // } else {
    //   this._service = new speechRecognition();
    //   this._service.continuous = true;
    //   this._service.interimResults = options?.displayInterimResults ?? true;
    //   this._service.lang = options?.lang || 'en-US';
    //   this.setEvents();
    // }
  }

  private static getSpeechConfig(sdkConfigType: typeof SpeechConfig) {
    // const speechConfig = sdkConfigType.fromAuthorizationToken(authorizationToken, regionOptions.value);
    const speechConfig = sdkConfigType.fromSubscription('', 'eastus');
    // speechConfig.outputFormat = sdk.OutputFormat.Detailed;
    // speechConfig.speechRecognitionLanguage = languageOptions.value;
    return speechConfig;
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

  private onRecognizing(_: Recognizer, event: SpeechRecognitionEventArgs) {
    this.updateElements(event.result.text, this.finalTranscript);
  }

  // WORK - huge opportunity to fix this in the repo!!!!!
  //   function onRecognized(sender, recognitionEventArgs) {
  //     var result = recognitionEventArgs.result;
  //     onRecognizedResult(recognitionEventArgs.result);
  // }

  private onRecognized(_: Recognizer, event: SpeechRecognitionEventArgs) {
    const result = event.result;
    switch (result.reason) {
      case sdk.ResultReason.Canceled:
        break;
      case sdk.ResultReason.RecognizedSpeech:
        if (result.text) {
          this.updateElements('', `${this.finalTranscript + result.text} `);
        }
        break;
    }
  }

  private onCanceled(_: Recognizer, event: sdk.SpeechRecognitionCanceledEventArgs) {
    if (event.reason === sdk.CancellationReason.Error) {
      this.error(event.errorDetails);
    }
  }

  // WORK - include an API for when the service is loading
  private onSessionStarted() {
    this.recognizing = true;
  }

  private onSessionStopped() {
    this.recognizing = false;
  }

  stop(isDuringReset?: boolean) {
    this._service?.stopContinuousRecognitionAsync();
    this.finalise(isDuringReset);
  }

  static isSupported(): boolean {
    // WORK - check if key is valid
    return !!window.webkitSpeechRecognition || window.SpeechRecognition;
  }

  private error(details: string) {
    console.error(details);
    this._onError?.(details);
    this.recognizing = false;
  }
}
