import { useState } from "react";
import axios from "axios";
import "./AIChat.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How many leads today?",
    "Show today's report",
    "Which policies expire this week?",
    "Show total contacts"
  ];

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/ai/chat`,
        { message }
      );

      setReply(res.data.reply);
    } catch (err) {
      setReply("Unable to connect to AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">

      <div className="chat-header">

        <div className="robot">
          🤖
        </div>

        <div>
          <h2>AI CRM Assistant</h2>
          <p>Ask anything about your CRM data</p>
        </div>

      </div>

      <div className="quick-grid">

        {quickQuestions.map((item, index) => (

          <button
            key={index}
            className="quick-btn"
            onClick={() => setMessage(item)}
          >
            {item}
          </button>

        ))}

      </div>

      <textarea
        className="chat-input"
        placeholder="Ask your question..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="send-btn"
        onClick={sendMessage}
      >
        🚀 Ask AI
      </button>

      {loading &&

        <div className="loading">

          AI is thinking...

        </div>

      }

      {reply &&

        <div className="response">

          <h4>AI Response</h4>

          <p>{reply}</p>

        </div>

      }

    </div>
  );
}