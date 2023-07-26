import {Options} from '../types/options';
import {Elements} from './elements';
import {Speech} from '../speech';
import {Cursor} from './cursor';

export class CommandUtils {
  private static toggleCommandModeOn(speech: Speech) {
    speech.isWaitingForCommand = true;
    speech.onCommandModeTrigger?.(false);
  }

  private static toggleCommandModeOff(speech: Speech) {
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

  public static execCommand(speech: Speech, options: Options, newText: string, element?: Element, originalText?: string) {
    const commands = options.commands;
    if (!commands || !element) return false;
    const lowerCaseText = newText.toLowerCase();
    if (commands.commandMode && lowerCaseText.includes(commands.commandMode)) {
      CommandUtils.toggleCommandModeOn(speech);
      speech.setInterimColorToFinal();
      return true;
    }
    if (commands.commandMode && !speech.isWaitingForCommand) return false;
    if (commands.stop && lowerCaseText.includes(commands.stop)) {
      speech.stop();
      CommandUtils.toggleCommandModeOff(speech);
      return true;
    }
    if (commands.pause && lowerCaseText.includes(commands.pause)) {
      speech.isPaused = true;
      speech.onPauseTrigger?.(true);
      CommandUtils.toggleCommandModeOff(speech);
      speech.setInterimColorToFinal();
      return true;
    }
    if (commands.resume && lowerCaseText.includes(commands.resume)) {
      speech.isPaused = false;
      speech.onPauseTrigger?.(false);
      CommandUtils.toggleCommandModeOff(speech);
      speech.resetRecording(options);
      return true;
    }
    if (commands.reset && lowerCaseText.includes(commands.reset)) {
      if (originalText !== undefined) CommandUtils.setText(speech, options, originalText, element);
      return true;
    }
    if (commands.removeAllText && lowerCaseText.includes(commands.removeAllText)) {
      CommandUtils.setText(speech, options, '', element);
      return true;
    }
    return false;
  }
}
