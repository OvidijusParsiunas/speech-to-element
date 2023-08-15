export class Text {
  private static readonly FIRST_CHAR_REGEX = /\S/;
  private static readonly DOUBLE_LINE = /\n\n/g;
  private static readonly ONE_LINE = /\n/g;

  public static capitalize(text: string) {
    return text.replace(Text.FIRST_CHAR_REGEX, (word) => {
      return word.toUpperCase();
    });
  }

  public static lineBreak(text: string) {
    return text.replace(Text.DOUBLE_LINE, '<p></p>').replace(Text.ONE_LINE, '<br>');
  }

  public static isCharDefined(char?: string) {
    return char !== undefined && char !== ' ' && char !== ' ' && char !== '\n' && char !== '';
  }

  public static breakupIntoWordsArr(text: string): string[] {
    return text.split(/(\W+)/);
  }
}
