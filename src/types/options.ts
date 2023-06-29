export interface Options {
  callback?: () => string;
  grammar?: string[];
  element?: HTMLElement;
  stopAfterSilenceMs?: number;
  displayInterimResults?: boolean;
  insertAtSelection?: boolean;
  textColor?: {interim?: string; final?: string};
  commands?: {[key: string]: string};
}
