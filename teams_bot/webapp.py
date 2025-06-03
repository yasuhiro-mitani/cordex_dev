from flask import Flask, jsonify, request
from summary_bot import fetch_user_messages, summarize_messages

app = Flask(__name__)

@app.route('/')
def index():
    days = int(request.args.get('days', 1))
    messages = fetch_user_messages(days)
    summary = summarize_messages(messages)
    return jsonify({'summary': summary, 'messages': messages})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
