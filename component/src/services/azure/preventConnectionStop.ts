import {Azure} from './azure';

// This is a mechanism used to prevent two azure services starting at once as it cannot actually be stopped when connecting
// however if it does not connect in 800 milliseconds, the user has an option to start a new connection
export class PreventConnectionStop {
  public static applyPrevention(azure: Azure) {
    clearTimeout(azure._manualConnectionStopPrevention);
    azure.cannotBeStopped = true;
    azure._manualConnectionStopPrevention = setTimeout(() => {
      azure.cannotBeStopped = false;
    }, 800);
  }

  public static clearPrevention(azure: Azure) {
    clearTimeout(azure._manualConnectionStopPrevention);
    azure.cannotBeStopped = false;
  }
}
