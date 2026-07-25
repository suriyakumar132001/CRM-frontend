import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api/aiChat';
import './AIChat.css';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your CRM assistant. Ask me anything." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setSending(true);
    setError('');

    try {
      const { data } = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply || "Sorry, I didn't get a response." }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.details || 'Something went wrong. Please try again.';
      setError(errMsg);
      setMessages((prev) => [...prev, { role: 'bot', text: `⚠️ ${errMsg}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        className={`ai-chat-fab ${isOpen ? 'ai-chat-fab-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI chat assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <span className="ai-chat-title">🤖 CRM Assistant</span>
            <button className="ai-chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {error && <div className="ai-chat-error-banner">{error}</div>}

          <div className="ai-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-bubble ai-chat-bubble-${m.role}`}>
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="ai-chat-bubble ai-chat-bubble-bot ai-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chat-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={sending}
            />
            <button type="submit" disabled={sending || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}