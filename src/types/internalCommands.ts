export interface InternalCommands {
  stop?: string | string[]; // 'stop'
  pause?: string | string[]; // 'pause'
  resume?: string | string[]; // 'continue'
  reset?: string | string[]; // 'start over'; // only works from the last mouse click
  removeAllText?: string | string[]; // 'remove all text';
  commandMode?: string | string[]; // 'wait' // like pause except it automatically resumes after a said command
  settings?: {
    substrings?: boolean; // true by default // marks if commands are full words or can be substrings of words
    caseSensitive?: boolean; // false by default // toggles if commands are case sensitive
  };
}
