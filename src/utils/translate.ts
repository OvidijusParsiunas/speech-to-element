import {Translations} from '../types/options';
import {Text} from './text';

export class Translate {
  public static translate(text: string, tranlsations: Translations) {
    const words = Text.breakupIntoWordsArr(text);
    for (let i = 0; i < words.length; i += 1) {
      if (tranlsations[words[i]]) {
        words[i] = tranlsations[words[i]];
      }
    }
    return words.join('');
  }
}
