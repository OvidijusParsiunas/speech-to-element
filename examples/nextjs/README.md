<img src="../../assets/banner-white.png" alt="Logo">

This is an example Next.js server template that can be used to fetch an Azure Speech Token for the [Speech To Element](https://www.npmjs.com/package/speech-to-element)'s [`retrieveToken`](https://github.com/OvidijusParsiunas/speech-to-element#azureoptions) function.

This project is fully setup and ready to be hosted by a platform such as [Vercel](https://vercel.com/).

### :computer: Local setup

If you are downloading the project via `git clone` - we advise you to use shallow cloning with the use of the [--depth 1](https://www.perforce.com/blog/vcs/git-beyond-basics-using-shallow-clones) option to reduce its size:

```
git clone --depth 1 https://github.com/OvidijusParsiunas/speech-to-element.git
```

Navigate to this directory and run the following command to download the dependencies:

```
npm install
```

Replace the [`process.env.SUBSCRIPTION_KEY`](https://github.com/OvidijusParsiunas/speech-to-element/blob/e740fee37cbea469624963517ea37593f39ed2fc/examples/nextjs/pages/api/token.ts#L16C4-L16C4) variable with your key string:

```
headers: {'Ocp-Apim-Subscription-Key': 'subscription key'},
```

Run the project:

```
npm run dev
```

When deploying to a hosting platform, make sure to set the `SUBSCRIPTION_KEY` environment variable.

### :wrench: Improvements

If you are experiencing issues with this project or have suggestions on how to improve it, do not hesitate to create a new ticket in [Github issues](https://github.com/OvidijusParsiunas/speech-to-element/issues) and we will look into it as soon as possible.
