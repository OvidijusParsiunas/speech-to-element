export class TextUtils {
  private static readonly FIRST_CHAR_REGEX = /\S/;
  private static readonly DOUBLE_LINE = /\n\n/g;
  private static readonly ONE_LINE = /\n/g;
  // private static readonly PUNCTUTION_MARKS_REGEX = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;

  public static capitalize(text: string) {
    return text.replace(TextUtils.FIRST_CHAR_REGEX, (word) => {
      return word.toUpperCase();
    });
  }

  public static lineBreak(text: string) {
    return text.replace(TextUtils.DOUBLE_LINE, '<p></p>').replace(TextUtils.ONE_LINE, '<br>');
  }

  // private static isLastCharPunctuation(text: string) {
  //   const lastChar = text.charAt(text.length - 1);
  //   return ProcessText.PUNCTUTION_MARKS_REGEX.test(lastChar);
  // }

  public static isLastCharDefined(text: string) {
    const lastChar = text.charAt(text.length - 1);
    return lastChar !== ' ' && lastChar !== ' ' && lastChar !== '\n' && lastChar !== '' && lastChar !== undefined;
  }
}
