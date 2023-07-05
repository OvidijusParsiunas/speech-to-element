export type OnError = (message: string) => void;

// WebSpeechAPI
// interim results are returned as final for Safari
export type OnResult = (text: string, isFinal: boolean) => void;

export interface TextColor {
  interim?: string;
  final?: string;
}

export interface Options {
  grammar?: string[];
  element?: HTMLElement;
  onResult?: OnResult;
  onError?: OnError;
  // WebSpeechAPI
  // does not display text in safari if this is set to false
  displayInterimResults?: boolean;
  insertInCursorLocation?: boolean;
  // only works for generic elements and not input, textarea
  textColor?: TextColor;
  stopAfterSilenceMS?: number;
  translations?: {[key: string]: string};
  anyElement?: boolean;
}
