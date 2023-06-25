export class ProcessText {
  private static readonly first_char = /\S/;
  private static readonly two_line = /\n\n/g;
  private static readonly one_line = /\n/g;

  public static capitalize(sentence: string) {
    return sentence.replace(ProcessText.first_char, (word) => {
      return word.toUpperCase();
    });
  }

  public static linebreak(sentence: string) {
    return sentence.replace(ProcessText.two_line, '<p></p>').replace(ProcessText.one_line, '<br>');
  }
}
