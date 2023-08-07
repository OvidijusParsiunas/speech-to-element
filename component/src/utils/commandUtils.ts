import {InternalCommands} from '../types/internalCommands';
import {Commands, Options} from '../types/options';
import {AutoScroll} from './autoScroll';
import {Elements} from './elements';
import {Browser} from './browser';
import {Speech} from '../speech';
import {Cursor} from './cursor';
import {Text} from './text';

type ExecutionResponse = undefined | {doNotProcessTranscription?: boolean};

export class CommandUtils {
  private static processCommand(command: string, settings?: Commands['settings']) {
    if (!settings || !settings.caseSensitive) command = command.toLowerCase();
    return settings?.substrings === false ? Text.breakupIntoWordsArr(command) : command;
  }

  public static process(commands: Commands): InternalCommands {
    if (commands.settings?.caseSensitive === true) return commands;
    const internalCommands: InternalCommands = Object.keys(commands).reduce((prev, current) => {
      const property = (commands as Required<Commands>)[current as keyof Commands];
      prev[current] = typeof property === 'string' ? CommandUtils.processCommand(property, commands.settings) : property;
      return prev;
    }, {} as {[prop: string]: string | string[] | InternalCommands['settings']});
    return internalCommands;
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

  private static setText(speech: Speech, options: Options, newText: string, element: Element) {
    CommandUtils.toggleCommandModeOff(speech);
    if (Elements.isPrimitiveElement(element)) {
      (element as HTMLInputElement).value = newText;
      if (!speech.isTargetInShadow) Cursor.setOffsetForPrimitive(element as HTMLInputElement, newText.length, true);
      if (Browser.IS_SAFARI() && speech.autoScroll) AutoScroll.scrollSafariPrimitiveToEnd(element as HTMLInputElement);
    } else {
      element.textContent = newText;
      if (!speech.isTargetInShadow) Cursor.focusEndOfGeneric(element as HTMLElement);
      setTimeout(() => AutoScroll.scrollGeneric(speech, element as HTMLElement));
    }
    speech.resetRecording(options);
  }

  private static checkIfMatchesSubstring(command: string | string[], text: string) {
    return text.includes(command as string);
  }

  private static checkIfMatchesWord(command: string | string[], _: string, textArr: string[]) {
    const commandWords = command as string[];
    for (let i = textArr.length - 1; i >= 0; i -= 1) {
      let textI = i;
      let commandI = commandWords.length - 1;
      while (textArr[textI] === commandWords[commandI] && commandI >= 0) {
        textI -= 1;
        commandI -= 1;
      }
      if (commandI < 0) return true;
    }
    return false;
  }

  // prettier-ignore
  public static execCommand(
      speech: Speech, newText: string, options?: Options, element?: Element, originalText?: string): ExecutionResponse {
    const commands = speech.commands;
    if (!commands || !element || !options) return;
    const text = commands.settings?.caseSensitive === true ? newText : newText.toLowerCase();
    const textArr = Text.breakupIntoWordsArr(text);
    const check =
      commands.settings?.substrings === false ? CommandUtils.checkIfMatchesWord : CommandUtils.checkIfMatchesSubstring;
    if (commands.commandMode && check(commands.commandMode, text, textArr)) {
      speech.setInterimColorToFinal();
      setTimeout(() => CommandUtils.toggleCommandModeOn(speech));
      return {doNotProcessTranscription: false};
    }
    if (commands.commandMode && !speech.isWaitingForCommand) return;
    if (commands.stop && check(commands.stop, text, textArr)) {
      CommandUtils.toggleCommandModeOff(speech);
      setTimeout(() => speech.stop());
      return {doNotProcessTranscription: false};
    }
    if (commands.pause && check(commands.pause, text, textArr)) {
      CommandUtils.toggleCommandModeOff(speech);
      speech.setInterimColorToFinal();
      setTimeout(() => {
        speech.isPaused = true;
        speech.onPauseTrigger?.(true);
      });
      return {doNotProcessTranscription: false};
    }
    if (commands.resume && check(commands.resume, text, textArr)) {
      speech.isPaused = false;
      speech.onPauseTrigger?.(false);
      CommandUtils.toggleCommandModeOff(speech);
      speech.resetRecording(options);
      return {doNotProcessTranscription: true};
    }
    if (commands.reset && check(commands.reset, text, textArr)) {
      if (originalText !== undefined) CommandUtils.setText(speech, options, originalText, element);
      return {doNotProcessTranscription: true};
    }
    if (commands.removeAllText && check(commands.removeAllText, text, textArr)) {
      CommandUtils.setText(speech, options, '', element);
      return {doNotProcessTranscription: true};
    }
    return;
  }
}
