# ChatGPT Long Chat Booster

A lightweight Tampermonkey userscript that improves browser-side performance in long ChatGPT conversations.

It reduces the rendering load of long chats by collapsing older messages, compacting heavy code blocks and tables, reducing animation cost, and optimizing media rendering.

Created by **mrkwxopya**.

---

## Links

- GitHub: https://github.com/mrkwxopya/ChatGPT-Long-Chat-Booster/
- GreasyFork: https://greasyfork.org/en/scripts/576699-chatgpt-long-chat-booster

---

## Features

- Automatically collapses older messages
- Keeps recent messages visible
- Compact mode for old code blocks
- Compact mode for old tables
- Media rendering optimization
- Animation reduction
- Sidebar rendering optimization
- Aggressive Mode for very long conversations
- Scroll-aware throttling
- URL change detection
- Keyboard shortcuts
- Local settings persistence
- No external requests
- No message automation
- No backend modification

---

## What This Script Does

ChatGPT Long Chat Booster only optimizes the local browser interface.

It can help when:

- A conversation becomes very long
- Scrolling starts to feel slow
- Code-heavy conversations cause lag
- Large markdown tables make the page heavy
- The browser uses too much CPU while viewing old chats
- The ChatGPT page feels slower after many messages

---

## What This Script Does Not Do

This script does not:

- Speed up OpenAI servers
- Speed up model response generation
- Bypass ChatGPT limits
- Send messages automatically
- Read or steal your conversations
- Modify ChatGPT backend behavior
- Make external network requests

It is only a local UI performance helper.

---

## Installation

### Option 1: Install from GreasyFork

Open the GreasyFork page and click **Install this script**:

```text
https://greasyfork.org/en/scripts/576699-chatgpt-long-chat-booster
```

Tampermonkey should detect the script automatically and show the install screen.

---

### Option 2: Install from GitHub Raw

Open the raw `.user.js` file in your browser:

```text
https://raw.githubusercontent.com/mrkwxopya/ChatGPT-Long-Chat-Booster/main/chatgpt-long-chat-booster.user.js
```

Tampermonkey should detect it automatically and show the install screen.

---

### Option 3: Manual Tampermonkey Install

1. Install the Tampermonkey browser extension.
2. Create a new userscript.
3. Copy the content of `chatgpt-long-chat-booster.user.js`.
4. Paste it into Tampermonkey.
5. Save the script.
6. Open or refresh ChatGPT.

Supported URLs:

```text
https://chatgpt.com/*
https://chat.openai.com/*
```

---

## Usage

After installation, open ChatGPT.

A small **ChatGPT Booster** panel appears at the bottom-right corner of the page.

From the panel, you can:

- Enable or disable the booster
- Choose how many recent messages stay open
- Enable or disable Aggressive Mode
- Compact old code blocks
- Compact old tables
- Reduce media rendering cost
- Reduce animations
- Optimize sidebar rendering
- Jump to the bottom of the chat
- Reset settings

---

## Recommended Settings

For normal long conversations:

```text
Enabled: On
Recent open messages: 18
Aggressive Mode: Off
Compact code blocks: On
Compact tables: On
Media optimization: On
Reduce animations: On
Sidebar optimization: On
Pause while scrolling: On
```

For very long technical chats:

```text
Enabled: On
Recent open messages: 10-14
Aggressive Mode: On
Compact code blocks: On
Compact tables: On
Media optimization: On
Reduce animations: On
Sidebar optimization: On
Pause while scrolling: On
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Alt + B` | Enable or disable the booster |
| `Alt + [` | Decrease the recent open message count |
| `Alt + ]` | Increase the recent open message count |

---

## Modes

### Normal Mode

Normal Mode is the safer default mode.

It keeps the latest messages open and collapses older messages. It also applies light rendering optimizations to code blocks, tables, media, animations, and the sidebar.

### Aggressive Mode

Aggressive Mode is designed for extremely long conversations.

It applies stronger limits to old code blocks, tables, and media elements. This can improve performance more, but older content may appear more compact until opened again.

---

## Privacy

This script is privacy-friendly.

It:

- Does not send data anywhere
- Does not use analytics
- Does not contact external APIs
- Does not collect chat content
- Does not store conversations
- Does not modify messages

Settings are stored locally in your browser using `localStorage`.

---

## Permissions

The script uses:

```text
@grant none
```

It does not require special Tampermonkey permissions.

---

## Browser Support

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Brave
- Firefox

Supported userscript managers:

- Tampermonkey
- Violentmonkey
- Greasemonkey-compatible managers

---

## Known Limitations

ChatGPT’s HTML structure may change over time. If OpenAI changes the page structure, some selectors may stop working.

If that happens:

1. Update the script.
2. Refresh ChatGPT.
3. Reset booster settings from the panel if needed.

This script improves browser rendering performance only. It cannot improve server response speed.

---

## Troubleshooting

### The panel does not appear

Try:

1. Refreshing ChatGPT.
2. Checking if the script is enabled in Tampermonkey.
3. Making sure the URL matches:

```text
https://chatgpt.com/*
https://chat.openai.com/*
```

---

### Messages are too compact

Increase the recent open message count from the panel.

Recommended values:

```text
18-24 for normal use
10-14 for very long chats
```

---

### Older messages are collapsed

Click a collapsed message to open it.

Use **Clear Pins** to allow the booster to collapse opened messages again.

---

### The page still feels slow

Try enabling:

```text
Aggressive Mode
Compact code blocks
Compact tables
Media optimization
Reduce animations
Sidebar optimization
```

Also try lowering the recent open message count.

---

## Repository Structure

Recommended repository structure:

```text
ChatGPT-Long-Chat-Booster/
├─ chatgpt-long-chat-booster.user.js
├─ README.md
├─ LICENSE
└─ CHANGELOG.md
```

---

## Changelog

### v2.0.0

- Added Aggressive Mode
- Added old code block compaction
- Added old table compaction
- Added media optimization
- Added sidebar optimization
- Added scroll-aware throttling
- Added keyboard shortcuts
- Added local settings persistence
- Added improved ChatGPT message detection
- Added safer MutationObserver throttling

---

## License

MIT License

---

## Author

Created by **mrkwxopya**

GitHub:

```text
https://github.com/mrkwxopya
```

Project repository:

```text
https://github.com/mrkwxopya/ChatGPT-Long-Chat-Booster/
```

GreasyFork:

```text
https://greasyfork.org/en/scripts/576699-chatgpt-long-chat-booster
```

---

## Disclaimer

This project is not affiliated with OpenAI.

ChatGPT is a product of OpenAI. This userscript only modifies the local browser interface for performance and usability purposes.
