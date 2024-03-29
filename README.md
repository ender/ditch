# ditch (archived)
Simple Discord bot created using an advanced handler from [MenuDocs](https://github.com/MenuDocs/discord.js-template) and modified (albeit slightly) for Discord.js v13.

**Note: This project is dead but may contain useful code for *someone* and/or possibly me in the future. It is always recommended to use the latest version of any software, and Discord.js is now on version `>= 14` while this project is based on version `13.6.0`.**

# usage

### requirements
- [Node.js](https://nodejs.org/en/download/current/) to run the project.

### setup
- Download [a zip archive of the project](https://github.com/ender/ditch/archive/refs/heads/main.zip) and unzip the files to a desired location.
- If you do not already have a Discord application, [create one](https://discord.com/developers/applications). After adding a bot to your application, copy its token and paste it into the `token` field in `config.json`.
- In a terminal: `cd` to the directory of the project, then run `npm install` (or the comparable command using your preferred Node.js package manager). Once the dependencies are installed, you should be able to run `npm start` to start the bot. If any errors occur the error message should be self explanatory but if not then check the section below. 

# for cross-platform users
If for some reason you fork or install this outdated and irrelevant project please note the following. [This line](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L121) and [this line](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L140) may have to be modified for use between operating systems as directory scrubbing may work different between them. This might also be true for other functions that access system files.

**Note: If this affects you, you will NOT SEE ANY OUTPUT. The terminal will simply hang indefinitely with no signs of error. You may have to mess around with the aforementioned lines to determine the exact path to the desired location which, assuming you are on a non-Windows operating system as it is most likely the reason you are experiencing this, you should know how to do.**
