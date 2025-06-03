# Teams Summary Bot

This repository contains a sample script for summarizing Microsoft Teams chat messages.

The script **`teams_bot/summary_bot.py`** fetches chat messages addressed to the authenticated user
using the Microsoft Graph API. It then generates a simple frequency-based summary
of those messages and prints both the summary and the individual messages.

## Requirements

- Python 3.11 or later
- `requests` library
- `Flask` for the optional browser interface
- A Microsoft Graph access token with permission to read Teams chat messages.
  Set the token in the environment variable `GRAPH_TOKEN`.

Install dependencies with:

```bash
pip install -r requirements.txt
```

## Usage

Fetch the last day of chat messages and produce a summary:

```bash
python teams_bot/summary_bot.py --days 1
```

Change the `--days` option to specify how many days of messages to retrieve.

### In the browser

You can also start a small web server that exposes the same functionality
through a browser. Run:

```bash
python teams_bot/webapp.py
```

Open your browser at `http://localhost:8000/` to see the summary.
You can add a `days` query parameter to change how many days of
messages to fetch, e.g. `http://localhost:8000/?days=3`.

## Notes

This script is a minimal example and does not implement a full bot
framework. You can integrate the functions in `teams_bot/summary_bot.py`
into a larger application or a bot service for Microsoft Teams.
