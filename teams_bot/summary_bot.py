import os
import datetime
import requests
from collections import Counter
import re
from typing import List, Dict

GRAPH_API_BASE = "https://graph.microsoft.com/v1.0"


def fetch_user_messages(days: int) -> List[Dict]:
    """Fetch chat messages addressed to the authenticated user from Microsoft Teams.

    This function requires a valid Microsoft Graph access token to be set in
    the environment variable `GRAPH_TOKEN`. The token must have the necessary
    permissions to read chat messages.
    """
    token = os.getenv("GRAPH_TOKEN")
    if not token:
        raise ValueError("GRAPH_TOKEN environment variable not set")

    since = (datetime.datetime.utcnow() - datetime.timedelta(days=days)).isoformat()
    headers = {"Authorization": f"Bearer {token}"}

    messages: List[Dict] = []
    url = f"{GRAPH_API_BASE}/me/chats"
    while url:
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        for chat in data.get("value", []):
            chat_id = chat.get("id")
            messages_url = f"{GRAPH_API_BASE}/chats/{chat_id}/messages"
            msg_resp = requests.get(messages_url, headers=headers)
            msg_resp.raise_for_status()
            for msg in msg_resp.json().get("value", []):
                created = msg.get("createdDateTime")
                if created and created >= since:
                    messages.append({
                        "id": msg.get("id"),
                        "from": msg.get("from", {}).get("user", {}).get("displayName"),
                        "content": msg.get("body", {}).get("content"),
                        "createdDateTime": created,
                    })
        url = data.get("@odata.nextLink")

    return messages


def summarize_messages(messages: List[Dict], max_sentences: int = 3) -> str:
    """Create a simple frequency-based summary from a list of messages."""
    text = " ".join(m["content"] for m in messages if m.get("content"))
    sentences = re.split(r"(?<=[.!?])\s+", text)
    if not sentences:
        return ""

    words = [word.lower().strip(".,!?") for word in text.split()]
    freq = Counter(words)
    scores = {sent: sum(freq.get(w.lower().strip(".,!?"), 0) for w in sent.split()) for sent in sentences}
    top_sentences = sorted(scores, key=scores.get, reverse=True)[:max_sentences]
    return " ".join(top_sentences)


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Summarize recent Teams messages")
    parser.add_argument("--days", type=int, default=1, help="Number of days to fetch messages for")
    args = parser.parse_args()

    messages = fetch_user_messages(args.days)
    summary = summarize_messages(messages)

    print("Summary:\n", summary)
    print("\nMessages:")
    for msg in messages:
        created = msg.get("createdDateTime")
        sender = msg.get("from")
        content = msg.get("content")
        print(f"[{created}] {sender}: {content}")


if __name__ == "__main__":
    main()
