export type OnError = (message: string) => void;

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
  displayInterimResults?: boolean;
  insertOnKeyDown?: boolean;
  insertOnMouseDown?: boolean;
  textColor?: TextColor;
  stopAfterSilenceMS?: number;
  commands?: {[key: string]: string};
  anyElement?: boolean;
}
