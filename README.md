# ditch (archived)

> A simple Discord bot originally built using the advanced handler from [MenuDocs](https://github.com/MenuDocs/discord.js-template), with slight modifications for Discord.js v13.

⚠️ **Note:** This project is no longer maintained. While it may contain useful snippets or structural examples, it is based on Discord.js version `13.6.0`. For new projects, it is highly recommended to use the latest version (`>=14`) of Discord.js.

---

## 🚀 Usage

### Requirements

- [Node.js](https://nodejs.org/en/download/current/) installed on your system.

### Setup

1. [Download the ZIP archive](https://github.com/ender/ditch/archive/refs/heads/main.zip) of this repository and extract it to a directory of your choice.
2. If you don’t already have a Discord application:
   - [Create one here](https://discord.com/developers/applications).
   - Add a bot to your application and copy its token.
   - Paste the token into the `token` field inside `config.json`.
3. Open a terminal:

   ```bash
   cd path/to/project
   npm install
   npm start
   ```

   If any errors occur, check the error message and refer to the section below if needed.

---

## 🖥 Cross-Platform Notes

If you're running this project on a non-Windows OS, be aware of potential issues related to file paths and directory handling.

- You may need to modify:
  - [Line 121 in Util.js](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L121)
  - [Line 140 in Util.js](https://github.com/ender/ditch/blob/8422976ff1c21408f3691cc5e3c97699e1560a7a/src/Structures/Util.js#L140)

If the bot appears to "hang" without error messages, this is likely the cause. You may need to manually trace the issue by logging values or adjusting the affected path resolution code.

---

## 🧊 Final Thoughts

This project is no longer being updated, but feel free to explore or fork it for learning purposes. If you're using this as a reference, please consider the age and versioning of the dependencies involved.

---

### 🔗 Related

- [Discord.js Guide](https://discordjs.guide/)
- [MenuDocs Discord.js Template](https://github.com/MenuDocs/discord.js-template)
