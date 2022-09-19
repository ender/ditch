# ditch (archived)
Simple Discord bot created using an advanced handler from [MenuDocs](https://github.com/MenuDocs/discord.js-template) and modified (albeit slightly) for Discord.js v13.

**This project is dead but may contain useful code for *someone* and/or possibly me in the future.**

# usage

### requirements
- [Node.js](https://nodejs.org/en/download/current/) to run the project.

### setup
- Download [a zip archive of the project](https://github.com/ender/ditch/archive/refs/heads/main.zip) and unzip the files to a desired location.
- If you do not already have a Discord bot token, [create an app in the Discord Developer Portal](https://discord.com/developers/applications). After creating an app, head to the applications **Bot** tab, and click **Add Bot** then **Yes, do it!** when it asks for confirmation. Finally, hit **Copy** under the **TOKEN** section and paste the token you just copied into the `token` field in `config.json`.
- In a terminal: `cd` to the directory of the project, then run `npm install` (or the comparable command using your preferred Node.js package manager). Once the dependencies are installed, you should be able to run `npm start` to start the bot. If any errors occur the error message should be self explanatory but if not then check the section below. 

# note
If for some reason someone wants to fork this outdated, insignificant, and irrelevant project, then [this line](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L121) and [this line](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L140) must be modified for use between Linux and/or Windows as directory scrubbing may work different between these two operating systems. The same might have to be done for other functions that access system files.
