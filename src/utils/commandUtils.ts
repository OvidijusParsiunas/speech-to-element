import {Commands, Options} from '../types/options';
import {Elements} from './elements';
import {Speech} from '../speech';
import {Cursor} from './cursor';
import {Text} from './text';

type ExecutionResponse = undefined | {removeCommandWord?: number; stop?: boolean};

export class CommandUtils {
  public static trimTranscripts(interimTranscript: string, finalTranscript: string, length: number) {
    if (interimTranscript) interimTranscript = interimTranscript.substring(0, interimTranscript.length - length);
    if (finalTranscript) finalTranscript = finalTranscript.substring(0, finalTranscript.length - length);
    return {interimTranscriptP: interimTranscript, finalTranscriptP: finalTranscript};
  }

  public static process(commands: Commands): Commands {
    if (commands.settings?.caseSensitive === true) return commands;
    return Object.keys(commands).reduce((prev, current) => {
      const property = (commands as Required<Commands>)[current as keyof Commands];
      prev[current] = typeof property === 'string' ? property.toLowerCase() : property;
      return prev;
    }, {} as {[prop: string]: string | Commands['settings']});
  }

  private static toggleCommandModeOn(speech: Speech) {
    speech.isWaitingForCommand = true;
    speech.onCommandModeTrigger?.(true);
  }

  public static toggleCommandModeOff(speech: Speech) {
    if (speech.isWaitingForCommand) {
      speech.onCommandModeTrigger?.(false);
      speech.isWaitingForCommand = false;
    }
  }

  private static setText(speech: Speech, options: Options, originalText: string, element: Element) {
    CommandUtils.toggleCommandModeOff(speech);
    if (Elements.isPrimitiveElement(element)) {
      (element as HTMLInputElement).value = originalText;
    } else {
      element.textContent = originalText;
      Cursor.setOffsetForGeneric(element as HTMLElement, originalText.length - 1);
    }
    speech.resetRecording(options);
  }

  private static checkIfMatchesSubstring(command: string, text: string) {
    return text.includes(command);
  }

  private static checkIfMatchesWord(command: string, _: string, textArr: string[]) {
    return textArr.includes(command);
  }

  private static getFullCommandWordLength(commands: Commands, command: string, textArr: string[]) {
    if (commands.settings?.substrings === false) {
      return command.length;
    }
    let letterCount = 0;
    for (let i = textArr.length - 1; i >= 0; i -= 1) {
      const word = textArr[i];
      letterCount += word.length;
      if (letterCount > command.length) break;
    }
    return letterCount;
  }

  // prettier-ignore
  public static execCommand(
      speech: Speech, options: Options, newText: string, element?: Element, originalText?: string): ExecutionResponse {
    const commands = options.commands;
    if (!commands || !element) return;
    const text = commands.settings?.caseSensitive === true ? newText : newText.toLowerCase();
    const textArr = Text.breakupIntoWordsArr(text);
    const check =
      commands.settings?.substrings === false ? CommandUtils.checkIfMatchesWord : CommandUtils.checkIfMatchesSubstring;
    if (commands.settings?.commandMode && check(commands.settings.commandMode, text, textArr)) {
      setTimeout(() => {
        CommandUtils.toggleCommandModeOn(speech);
      });
      speech.setInterimColorToFinal();
      return {removeCommandWord: CommandUtils.getFullCommandWordLength(commands, commands.settings.commandMode, textArr) };
    }
    if (commands.settings?.commandMode && !speech.isWaitingForCommand) return;
    if (commands.stop && check(commands.stop, text, textArr)) {
      speech.stop();
      CommandUtils.toggleCommandModeOff(speech);
      return {removeCommandWord: CommandUtils.getFullCommandWordLength(commands, commands.stop, textArr) };
    }
    if (commands.pause && check(commands.pause, text, textArr)) {
      setTimeout(() => {
        speech.isPaused = true;
        speech.onPauseTrigger?.(true);
      });
      CommandUtils.toggleCommandModeOff(speech);
      speech.setInterimColorToFinal();
      return {removeCommandWord: CommandUtils.getFullCommandWordLength(commands, commands.pause, textArr) };
    }
    if (commands.resume && check(commands.resume, text, textArr)) {
      speech.isPaused = false;
      speech.onPauseTrigger?.(false);
      CommandUtils.toggleCommandModeOff(speech);
      speech.resetRecording(options);
      return {stop: true};
    }
    if (commands.reset && check(commands.reset, text, textArr)) {
      if (originalText !== undefined) CommandUtils.setText(speech, options, originalText, element);
      return {stop: true};
    }
    if (commands.removeAllText && check(commands.removeAllText, text, textArr)) {
      CommandUtils.setText(speech, options, '', element);
      return {stop: true};
    }
    return;
  }
}
