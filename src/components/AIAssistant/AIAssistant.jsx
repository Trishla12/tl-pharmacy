import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';

const AIAssistant = () => {
  const { showAssistant, setShowAssistant } = useUIStore();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m TL AI Assistant. How can I help you today? 🤖', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Find pain relief',
    'Ayurvedic products',
    'Wellness items',
    'Track my order',
  ];

  const handleSendMessage = (text = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = {
        'find pain relief': 'I found several pain relief products for you. Would you like to browse our Pain Relief category?',
        'ayurvedic products': 'We have a wide range of authentic Ayurvedic products. Would you like to explore our Ayurvedic section?',
        'wellness items': 'Check out our Wellness category for health devices, nutrition, and fitness products.',
        'track my order': 'Please log in to your account to track your orders. Would you like help with anything else?',
      };

      const response =
        botResponses[text.toLowerCase()] ||
        'I can help you find products, answer pharmacy questions, and assist with orders. What would you like help with?';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response,
          sender: 'bot',
        },
      ]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Float Button */}
      {!showAssistant && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-soft-lg hover:shadow-soft-lg"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {showAssistant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-soft-lg flex flex-col h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">TL AI Assistant</h3>
                <p className="text-xs opacity-80">Always here to help</p>
              </div>
              <button
                onClick={() => setShowAssistant(false)}
                className="p-2 hover:bg-primary-dark rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-light">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-white text-dark rounded-bl-none shadow-soft'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="bg-white px-4 py-2 rounded-2xl shadow-soft">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 0 }}
                          animate={{ y: -8 }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          className="w-2 h-2 bg-primary rounded-full"
                        ></motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-light space-y-2">
                <p className="text-xs text-secondary font-semibold">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-full hover:bg-primary-light transition"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-light flex gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 outline-none text-sm px-3 py-2 bg-light rounded-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;