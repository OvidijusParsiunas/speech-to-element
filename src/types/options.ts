export interface Options {
  callback?: () => string;
  grammar?: string[];
  element?: HTMLElement;
  stopAfterSilenceMs?: number;
  displayInterimResults?: boolean;
  insertAtSelection?: boolean;
  commands?: {[key: string]: string};
}
