export interface Options {
  element?: Element | Element[];
  onStart?: () => void;
  onStop?: () => void;
  onResult?: OnResult;
  onPreResult?: OnPreResult;
  onCommandModeTrigger?: OnCommandModeTrigger;
  onPauseTrigger?: OnPauseTrigger;
  onError?: OnError;
  // WebSpeech
  // does not display text in safari if this is set to false
  displayInterimResults?: boolean;
  // does not work for shadow elements as getSelection is not supported natively for all browsers
  insertInCursorLocation?: boolean;
  // default - true
  autoScroll?: boolean;
  // only works for generic elements and not input, textarea
  textColor?: TextColor;
  // need to define text for lower and upper cases
  translations?: Translations;
  commands?: Commands;
}

// WebSpeech
// interim results are returned as final for Safari
export type OnResult = (text: string, isFinal: boolean) => void;

// WebSpeech
// interim results are returned as final for Safari
// continue/stop/restart and choose whether the text is displayed
export type OnPreResult = (
  text: string,
  isFinal: boolean
  // removeNewText only works with either stop or restart used
) => {stop?: boolean; restart?: boolean; removeNewText?: boolean} | void | null | undefined;

export type OnCommandModeTrigger = (isStart: boolean) => void;

export type OnPauseTrigger = (isStart: boolean) => void;

export type OnError = (message: string) => void;

export interface TextColor {
  interim?: string;
  final?: string;
}

export interface Translations {
  [key: string]: string;
}

export interface AzureOptions {
  retrieveToken?: () => Promise<string | void>;
  subscriptionKey?: string;
  token?: string;
  region: string;
  // https://docs.microsoft.com/azure/cognitive-services/speech-service/supported-languages
  language?: string;
  // max 4 languages can be added (azure limitation)
  autoLanguages?: [string, ...string[]] & { length: 1 | 2 | 3 | 4 };
  // default - 20s
  stopAfterSilenceMs?: number;
}

export interface WebSpeechOptions {
  // BCP 47 language tag
  // If not specified, this defaults to the HTML lang (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html#lang)
  // attribute value, or the user agent's language setting if that isn't set either.
  language?: string;
}

export interface Commands {
  stop?: string; // 'stop'
  pause?: string; // 'pause'
  resume?: string; // 'continue'
  reset?: string; // 'start over'; // only works from the last mouse click
  removeAllText?: string; // 'remove all text';
  commandMode?: string; // 'wait' // like pause except it automatically resumes after a said command
  settings?: {
    substrings?: boolean; // true by default // marks if commands are full words or can be substrings of words
    caseSensitive?: boolean; // false by default // toggles if commands are case sensitive
  };
}
