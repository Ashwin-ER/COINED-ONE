import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import { geminiService } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { INITIAL_GREETING } from '../constants';
import { Coins, Info } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Initialize chat only once
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMessages([
        {
          id: 'init-1',
          role: Role.MODEL,
          content: INITIAL_GREETING,
        },
      ]);
      // Pre-warm the chat session
      geminiService.startChat().catch(console.error);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    // Add user message immediately
    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: Role.USER,
      content: text,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await geminiService.sendMessage(text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: responseText,
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "I'm having a little trouble thinking right now. Could you ask that again?",
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Coins size={20} className="drop-shadow-sm" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight tracking-tight">COINED ONE</h1>
            <p className="text-xs text-teal-600 font-medium">UAE Mortgage Friend</p>
          </div>
        </div>
        <button 
          className="p-2 text-gray-400 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-50"
          onClick={() => window.open('https://www.bankfab.com/en-ae/personal/mortgages/mortgage-calculator', '_blank')}
        >
          <Info size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-teal-600 shadow-sm">
                   <Coins size={16} />
                 </div>
                 <TypingIndicator />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <div className="flex-none">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;