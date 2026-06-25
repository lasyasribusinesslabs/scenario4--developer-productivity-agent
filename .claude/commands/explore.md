# /explore — Codebase Exploration Command

## Usage
```
/explore <topic>
```

## What this command does

When invoked, this command triggers the full exploration workflow for the given topic:

1. **Grep** for the topic keyword across the entire codebase
2. **Glob** for files whose names match the topic
3. **Read** only the files identified in steps 1 and 2
4. **Trace imports** to find connected files
5. **Summarise** the flow in plain English
6. **Append findings** to `scratchpad.md`

## Example
```
/explore auth middleware
/explore password reset
/explore order model
```

## Notes
- Always Grep before reading
- Never read more than 10 files per /explore invocation
- If the topic spans more than 5 files, delegate to the `deep-explorer` subagent
- Save every /explore result to scratchpad.md
