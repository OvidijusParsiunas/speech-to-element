export class Browser {
  private static _IS_SAFARI: boolean;

  // In a function in order to use navigator later as otherwise ssr (nextjs) fails
  public static readonly IS_SAFARI = () => {
    if (Browser._IS_SAFARI === undefined) {
      Browser._IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    return Browser._IS_SAFARI;
  };
}
