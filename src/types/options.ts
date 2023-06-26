export interface Options {
  callback?: () => string;
  grammar?: string[];
  element?: HTMLElement;
  displayInterimResults?: boolean;
  commands?: {[key: string]: string};
}
