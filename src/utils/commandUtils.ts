import {Commands, Options} from '../types/options';
import {Elements} from './elements';
import {Speech} from '../speech';
import {Cursor} from './cursor';
import {Text} from './text';

export class CommandUtils {
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

  private static checkIfMatchesSubstring(command: string, newText: string) {
    return newText.includes(command);
  }

  private static checkIfMatchesWord(command: string, _: string, newTextArr: string[]) {
    return newTextArr.includes(command);
  }

  public static execCommand(speech: Speech, options: Options, newText: string, element?: Element, originalText?: string) {
    const commands = options.commands;
    if (!commands || !element) return false;
    const text = commands.settings?.caseSensitive === true ? newText : newText.toLowerCase();
    const newWords = commands.settings?.substrings === false ? Text.breakupIntoWordsArr(text) : [];
    const check =
      commands.settings?.substrings === false ? CommandUtils.checkIfMatchesWord : CommandUtils.checkIfMatchesSubstring;
    if (commands.settings?.commandMode && check(commands.settings?.commandMode, text, newWords)) {
      CommandUtils.toggleCommandModeOn(speech);
      speech.setInterimColorToFinal();
      return true;
    }
    if (commands.settings?.commandMode && !speech.isWaitingForCommand) return false;
    if (commands.stop && check(commands.stop, text, newWords)) {
      speech.stop();
      CommandUtils.toggleCommandModeOff(speech);
      return true;
    }
    if (commands.pause && check(commands.pause, text, newWords)) {
      speech.isPaused = true;
      speech.onPauseTrigger?.(true);
      CommandUtils.toggleCommandModeOff(speech);
      speech.setInterimColorToFinal();
      return true;
    }
    if (commands.resume && check(commands.resume, text, newWords)) {
      speech.isPaused = false;
      speech.onPauseTrigger?.(false);
      CommandUtils.toggleCommandModeOff(speech);
      speech.resetRecording(options);
      return true;
    }
    if (commands.reset && check(commands.reset, text, newWords)) {
      if (originalText !== undefined) CommandUtils.setText(speech, options, originalText, element);
      return true;
    }
    if (commands.removeAllText && check(commands.removeAllText, text, newWords)) {
      CommandUtils.setText(speech, options, '', element);
      return true;
    }
    return false;
  }
}
