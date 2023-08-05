<img src="../../../assets/banner-white.png" alt="Logo">

This is an example Flask server template that can be used to fetch an Azure Speech Token for the [Speech To Element](https://www.npmjs.com/package/speech-to-element)'s [`retrieveToken`](https://github.com/OvidijusParsiunas/speech-to-element#azureoptions) function.

### :calling: UI example

This server is preconfigured to work with the example [UI project](https://github.com/OvidijusParsiunas/speech-to-element/tree/main/examples/ui). Once both are running - they should be able to communicate with each other right out of the box.

### :computer: Local setup

If you are downloading the project via `git clone` - we advise you to use shallow cloning with the use of the [--depth 1](https://www.perforce.com/blog/vcs/git-beyond-basics-using-shallow-clones) option to reduce its size:

```
git clone --depth 1 https://github.com/OvidijusParsiunas/speech-to-element.git
```

Create an `.env` file with the following variables (see the `.env.example` file):

```
SUBSCRIPTION_KEY=subscription-key
REGION=region
```

Navigate to the `src` directory and run the following command to install the required packages:

```
pip install flask flask-cors load_dotenv
```

Run the project:

```
python app.py
```

### :wrench: Improvements

If you are experiencing issues with this project or have suggestions on how to improve it, do not hesitate to create a new ticket in [Github issues](https://github.com/OvidijusParsiunas/speech-to-element/issues) and we will look into it as soon as possible.
