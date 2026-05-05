# ChatGPT Long Chat Booster

A lightweight Tampermonkey userscript that improves browser-side performance in long ChatGPT conversations.

It works by reducing the rendering load of very long chats. Older messages can be collapsed automatically, large code blocks and tables can be compacted, animations can be reduced, and heavy media elements can be optimized.

Created by **mrkwxopya**.

---

## Features

- Automatically collapses old messages
- Keeps recent messages visible
- Compact mode for old code blocks
- Compact mode for old tables
- Media rendering optimization
- Animation reduction
- Sidebar optimization
- Aggressive Mode for very long conversations
- Scroll-aware throttling
- URL change detection
- Alt + B shortcut
- No external requests
- No message automation
- No backend modification

---

## What This Script Does

ChatGPT Long Chat Booster only optimizes the local browser interface.

It can help when:

- A conversation has become very long
- The page scrolls slowly
- Code-heavy conversations start lagging
- Large markdown tables make the page feel heavy
- The browser uses too much CPU while viewing old chats

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

### Option 1: Install with Tampermonkey

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

### Option 2: Install from GitHub Raw

After uploading the script to GitHub, open the raw `.user.js` file in your browser.

Example:

```text
https://raw.githubusercontent.com/mrkwxopya/chatgpt-long-chat-booster/main/chatgpt-long-chat-booster.user.js
```

Tampermonkey should detect it automatically and show the install screen.

---

### Option 3: Install from GreasyFork

After publishing on GreasyFork, add the GreasyFork script link here:

```text
https://greasyfork.org/scripts/YOUR_SCRIPT_ID-chatgpt-long-chat-booster
```

---

## Usage

After installation, open ChatGPT.

A small **ChatGPT Booster** panel appears at the bottom-right corner of the page.

From the panel, you can:

- Enable or disable the booster
- Choose how many recent messages stay open
- Enable Aggressive Mode
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
| `Alt + B` | Enable / disable booster |
| `Alt + [` | Decrease recent open message count |
| `Alt + ]` | Increase recent open message count |

---

## Modes

### Normal Mode

Normal Mode is the safer default mode.

It keeps the latest messages open and collapses older messages. It also applies light rendering optimizations to code blocks, tables, media, and animations.

### Aggressive Mode

Aggressive Mode is designed for extremely long conversations.

It applies stronger limits to old code blocks, tables, and media elements. This can improve performance more, but old content may appear more compact until opened again.

---

## Privacy

This script is privacy-friendly.

It:

- Does not send data anywhere
- Does not use analytics
- Does not contact external APIs
- Does not collect chat content
- Does not store conversations

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

Recommended:

- Google Chrome
- Microsoft Edge
- Brave
- Firefox

Required extension:

- Tampermonkey
- Violentmonkey
- Greasemonkey-compatible userscript manager

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

### Old messages are hidden

Click a collapsed message to open it.

Use **Pin temizle** / **Clear pins** to let the booster collapse it again.

---

### Page still feels slow

Try enabling:

```text
Aggressive Mode
Compact code blocks
Compact tables
Media optimization
Reduce animations
```

Also try lowering the recent open message count.

---

## File Structure

Recommended repository structure:

```text
chatgpt-long-chat-booster/
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

---

## Disclaimer

This project is not affiliated with OpenAI.

ChatGPT is a product of OpenAI. This userscript only modifies the local browser interface for performance and usability purposes.
