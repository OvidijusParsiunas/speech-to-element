export interface Options {
  callback?: () => string;
  grammar?: string[];
  element?: HTMLElement;
  stopAfterSilenceMs?: number;
  displayInterimResults?: boolean;
  insertAtSelection?: boolean;
  resetOnKeyDown?: boolean;
  resetOnMouseDown?: boolean;
  textColor?: {interim?: string; final?: string};
  commands?: {[key: string]: string};
  anyElement?: boolean;
}
