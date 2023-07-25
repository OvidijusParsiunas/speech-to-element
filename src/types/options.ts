export interface Translations {
  [key: string]: string;
}

export type OnError = (message: string) => void;

// WebSpeechAPI
// interim results are returned as final for Safari
export type OnResult = (text: string, isFinal: boolean) => void;

export interface TextColor {
  interim?: string;
  final?: string;
}

export interface AzureOptions {
  retrieveToken?: () => string;
  subscriptionKey?: string;
  token?: string;
  region?: string;
  // https://docs.microsoft.com/azure/cognitive-services/speech-service/supported-languages
  language?: string;
}

export interface WebSpeechAPIOptions {
  // BCP 47 language tag
  // If not specified, this defaults to the HTML lang (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html#lang)
  // attribute value, or the user agent's language setting if that isn't set either.
  language?: string;
}

export interface Options {
  element?: Element | Element[];
  onStart?: () => void;
  onStop?: () => void;
  onResult?: OnResult;
  onError?: OnError;
  // WebSpeechAPI
  // does not display text in safari if this is set to false
  displayInterimResults?: boolean;
  // does not work for shadow elements as getSelection is not supported natively for all browsers
  insertInCursorLocation?: boolean;
  // default - true
  scrollIntoView?: boolean;
  // only works for generic elements and not input, textarea
  textColor?: TextColor;
  stopAfterSilenceMS?: number;
  // need to define text for lower and upper cases
  translations?: Translations;
}
