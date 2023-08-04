<img src="./assets/banner-white.png" alt="Logo">

<b>Speech To Element</b> is an all purpose library that transcribes your speech into text right out of the box! Try it out in the [official website](WORK).

### :zap: Services

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
- [Azure Cognitive Speech Services API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text)

### :computer: How to use

[NPM](https://www.npmjs.com/package/speech-to-element):

```
npm install speech-to-element
```

```
import SpeechToElement from 'speech-to-element';

const targetElement = document.getElementById('target-element');
SpeechToElement.toggle("webspeech", {element: targetElement});
```

[CDN](https://cdn.jsdelivr.net/gh/ovidijusparsiunas/speech-to-element@master/component/bundle/index.js):

```
<script type="module" src="https://cdn.jsdelivr.net/gh/ovidijusparsiunas/speech-to-element@master/component/bundle/index.js"></script>
```

```
const targetElement = document.getElementById('target-element');
window.SpeechToElement.toggle("webspeech", {element: targetElement});
```

When using Azure, you will also need to install its speech [SDK](https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk). Read more in the [Azure SDK](#floppy_disk-azure-sdk) section. <br />
Make sure to checkout the [`examples`](https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples) directory to browse templates for [`React`](https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/ui), [`Next.js`](https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/nextjs) and more.

https://github.com/OvidijusParsiunas/speech-to-element/assets/18709577/e2e618f8-b61c-4877-804b-26eeefbb0afa

### :beginner: API

#### Methods

Used to control Speech To Element transcription:

| Name                                                                                   | Description                                                                                                           |
| :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| startWebSpeech({[`Options`](#options) & [`WebSpeechOptions`](#webspeechoptions)})      | Start [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)      |
| startAzure({[`Options`](#options) & [`AzureOptions`](#azureoptions)})                  | Start [Azure API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text)                  |
| toggle("webspeech", {[`Options`](#options) & [`WebSpeechOptions`](#webspeechoptions)}) | Start/Stop [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API) |
| toggle("azure", {[`Options`](#options) & [`AzureOptions`](#azureoptions)})             | Start/Stop [Azure API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text)             |
| stop()                                                                                 | Stops all speech services                                                                                             |
| endCommandMode()                                                                       | Ends the [`command`](#commands) mode                                                                                  |

Examples:

```
SpeechToElement.startWebSpeech({element: targetElement, displayInterimResults: false});
SpeechToElement.startAzure({element: targetElement, region: "westus", token: "token"});
SpeechToElement.toggle("webspeech", {element: targetElement, language: "en-US"});
SpeechToElement.toggle("azure", {element: targetElement, region: "eastus", subscriptionKey: "key"});
SpeechToElement.stop();
SpeechToElement.endCommandMode();
```

#### Object Types

##### Options:

Generic options for the speech to element functionality:

| Name                       | Type                                                                      | Description                                                                                                                                                      |
| :------------------------- | :------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| element                    | `Element \| Element[]`                                                    | Transcription target element. By defining multiple inside an array the user can switch between them in the same session by clicking on them.                     |
| autoScroll                 | `boolean`                                                                 | Controls if element will automatically scroll to the new text.                                                                                                   |
| displayInterimResults      | `boolean`                                                                 | Controls if interim result are displayed.                                                                                                                        |
| textColor                  | [`TextColor`](#textcolor)                                                 | Object defining the result text colors.                                                                                                                          |
| stopAfterSilenceMs         | `number`                                                                  | Milliseconds of silence required for the speech service to automatically stop. Default is 25000ms (25 seconds).                                                  |
| translations               | `{[key: string]: string}`                                                 | Case-sensitive one-to-one map of words that will automatically be translated to others.                                                                          |
| commands                   | [`Commands`](#commands)                                                   | Set the phrases that will trigger various chat functionality.                                                                                                    |
| onStart                    | `() => void`                                                              | Triggered when speech recording has started.                                                                                                                     |
| onStop                     | `() => void`                                                              | Triggered when speech recording has stopped.                                                                                                                     |
| onResult                   | `( text: string, isFinal: boolean ) => void`                              | Triggered when a new result is transcribed and inserted into element.                                                                                            |
| onPreResult                | `( text: string, isFinal: boolean )` => [PreResult](#preresult) \| `void` | Triggered before result text insertion. This function can be used to control the speech service based on what was spoken via the [PreResult](#preresult) object. |
| onCommandMode<br />Trigger | `(isStart: boolean) => void`                                              | Triggered when command mode is initiated and stopped.                                                                                                            |
| onPauseTrigger             | `(isStart: boolean) => void`                                              | Triggered when the pause command is initiated and stopped via resume command.                                                                                    |
| onError                    | `(message: string) => void`                                               | Triggered when an error has occurred.                                                                                                                            |

Examples:

```
SpeechToElement.toggle("webspeech", {element: targetElement, translations: {hi: 'bye', Hi: 'Bye'}});
SpeechToElement.toggle("webspeech", {onResult: (text) => console.log(text)});
```

##### TextColor:

Object used to set the color for transcription result text (does not work for `input` and `textarea` elements):

| Name    | Type     | Description          |
| :------ | :------- | :------------------- |
| interim | `string` | Temporary text color |
| final   | `string` | Final text color     |

Example:

```
SpeechToElement.toggle("webspeech", {
  element: targetElement, textColor: {interim: 'grey', final: 'black'}
});
```

##### Commands:

https://github.com/OvidijusParsiunas/speech-to-element/assets/18709577/76351a54-7e70-4e39-8816-3106616c92f2

Object used to set the phrases of commands that will control transcription and input functionality:

| Name          | Type                                  | Description                                                                                                                                             |
| :------------ | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| stop          | `string`                              | Stop the speech service                                                                                                                                 |
| pause         | `string`                              | Temporarily stops the transcription and re-enables it after the phrase for `resume` is spoken.                                                          |
| resume        | `string`                              | Re-enables transcription after it has been stopped by the `pause` or `commandMode` commands.                                                            |
| reset         | `string`                              | Remove the transcribed text (since the last element cursor move)                                                                                        |
| removeAllText | `string`                              | Remove all element text                                                                                                                                 |
| commandMode   | `string`                              | Activate the command mode which will stops transcription and waits for a command to be executed. Use the phrase for `resume` to leave the command mode. |
| settings      | [`CommandSettings`](#commandsettings) | Controls how command mode is used.                                                                                                                      |

Example:

```
SpeechToElement.toggle("webspeech", {
  element: targetElement,
  commands: {
    pause: "pause",
    resume: "resume",
    removeAllText: "remove text",
    commandMode: "command"
  }
});
```

##### CommandSettings:

Object used to configure how the command phrases are interpreted:

| Name          | Type      | Description                                                                                                                                                                                                                                                                                                |
| :------------ | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| substrings    | `boolean` | Toggles whether command phrases can be part of spoken words or if they are whole words. E.g. when this is set to _true_ and your command phrase is _"stop"_ - when you say "stopping" the command will be executed. However if it is set to _false_ - the command will only be executed if you say "stop". |
| caseSensitive | `boolean` | Toggles if command phrases are case sensitive. E.g. if this is set to _true_ and your command phrase is _"stop"_ - when the service recognizes your speech as "Stop" it will not execute your command. On the other hand if it is set to _false_ it will execute.                                          |

Example:

```
SpeechToElement.toggle("webspeech", {
  element: targetElement,
  commands: {
    removeAllText: "remove text"
    "settings": {
      "substrings": true,
      "caseSensitive": false
  }}
});
```

##### PreResult:

Result object for the `onPreResult` function. This can be used to control the speech service and facilitate custom commands for your application:

| Name          | Type      | Description                                                                                                       |
| :------------ | :-------- | :---------------------------------------------------------------------------------------------------------------- |
| stop          | `boolean` | Stops the speech service                                                                                          |
| restart       | `boolean` | Restarts the speech service                                                                                       |
| removeNewText | `boolean` | Toggles whether the newly spoken (interim) text is removed when either of the above properties are set to `true`. |

Example for a creating a custom command:

```
SpeechToElement.toggle("webspeech", {
  element: targetElement,
  onPreResult: (text) => {
    if (text.toLowerCase().includes("custom command")) {
      SpeechToElement.endCommandMode();
      your custom code here
      return {restart: true, removeNewText: true};
  }}
});
```

##### WebSpeechOptions:

Custom options for the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API):

| Name     | Type     | Description                                                                                                                                                                              |
| :------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| language | `string` | This is the recognition language. See the following [`QA`](https://stackoverflow.com/questions/23733537/what-are-the-supported-languages-for-web-speech-api-in-html5) for the full list. |

Example:

```
SpeechToElement.toggle("webspeech", {element: targetElement, language: "en-GB"});
```

##### AzureOptions:

Options for the [Azure Cognitive Speech Services API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text). This object requires `region` and either `retrieveToken`, `subscriptionKey` or the `token` properties to be defined with it:

| Name            | Type                    | Description                                                                                                                                                                                                                                                                                                                                            |
| :-------------- | :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| region          | `string`                | Location/region of your Azure speech resource.                                                                                                                                                                                                                                                                                                         |
| retrieveToken   | `() => Promise<string>` | Function used to retrieve a new token for your Azure speech resource. It is the recommended property to use as it can retrieve the token from a secure server that will hide your credentials. Check out the [starter server templates](https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples) to start a local server in seconds. |
| subscriptionKey | `string`                | Subscription key for your Azure speech resource.                                                                                                                                                                                                                                                                                                       |
| token           | `string`                | Temporary token for the Azure speech resource.                                                                                                                                                                                                                                                                                                         |
| language        | `string`                | BCP-47 string value to denote the recognition language. You can find the full list [here](https://docs.microsoft.com/azure/cognitive-services/speech-service/supported-languages).                                                                                                                                                                     |

Examples:

```
SpeechToElement.toggle("azure", {element: targetElement, token: "token", language: "ja-JP"});

SpeechToElement.toggle("azure", {
  element: targetElement,
  region: 'southeastasia',
  retrieveToken: async () => {
    return fetch('http://localhost:8080/token')
      .then((res) => res.text())
      .then((token) => token)
      .catch((error) => console.error('error'));
  }
});
```

Example server templates for the `retrieveToken` property:

| Express                                                                                                                                                                                                                                        | Nest                                                                                                                                                                                                                                       | Flask                                                                                                                                                                                                                                        | Spring                                                                                                                                                                                                                                               | Go                                                                                                                                                                                                                              | Next                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/node/express" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/expressLogo.png" width="60"/></a> | <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/node/nestjs" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/nestLogo.png" width="60"/></a> | <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/python/flask" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/flaskLogo.png" width="60"/></a> | <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/java/springboot" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/springBootLogo.png" width="50"/></a> | <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/go" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/goLogo.png" width="40"/></a> | <a href="https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/nextjs" target="_blank"><img src="https://raw.githubusercontent.com/OvidijusParsiunas/speech-to-element/HEAD/assets/nextLogo.png" width="55"/></a> |

<br />

### :floppy_disk: Azure SDK

To use the [Azure Cognitive Speech Services API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-to-text), you will need to add the official [Azure Speech SDK](https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk) into your project and assign it to the `window.SpeechSDK` variable. Here are some simple ways you can achieve this:

- <b>Import from a dependancy:</b>
  If you are using a dependancy manager, import and assign it to window.SpeechSDK:

  ```
  import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
  window.SpeechSDK = sdk;
  ```

- <b>Dynamic import from a dependancy</b>
  If you are using a dependancy manager, dynamically import and assign it to window.SpeechSDK:

  ```
  import('microsoft-cognitiveservices-speech-sdk').then((module) => {
     window.SpeechSDK = module;
  });
  ```

- <b>Script from a CDN</b>
  You can add a script tag to your markup or create one via javascript. The window.SpeechSDK property will be populated automatically:

  ```
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>

  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js";
  document.body.appendChild(script);
  ```

If your project is using `TypeScript`, add this to the file where the module is used:

```
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
declare global {
  interface Window {
    SpeechSDK: typeof sdk;
  }
}
```

Examples:

Example React project that uses a package bundler. It should work similarly for other UI frameworks:

// WORK - examples

[Click for Live Example](https://stackblitz.com/edit/stackblitz-starters-u6bayx?file=src%2FApp.tsx)

VanillaJS approach with no bundler (this can also be used as fallback if above doesn't work):

[Click for Live Example](https://codesandbox.io/s/speech-to-element-azure-vanillajs-gvj9v4?file=/index.html)

## :heart: Contributions

Open source is built by the community for the community. All contributions to this project are welcome!<br>
Additionally, if you have any suggestions for enhancements, ideas on how to take the project further or have discovered a bug, do not hesitate to create a new issue ticket and we will look into it as soon as possible!
