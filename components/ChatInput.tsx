import React, { useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 md:px-6 md:py-4 safe-area-bottom">
      <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-3xl px-2 py-2 shadow-inner focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all duration-200">
        
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about mortgages, buy vs rent, or costs..."
            className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-[120px] py-2.5 px-3 text-gray-800 placeholder-gray-400 outline-none overflow-y-auto custom-scrollbar"
            rows={1}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
            ${input.trim() && !isLoading 
              ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md transform hover:scale-105 active:scale-95' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Sparkles size={18} className="animate-spin" />
          ) : (
            <Send size={18} className="ml-0.5" />
          )}
        </button>
      </div>
      <div className="text-center mt-2">
         <p className="text-[10px] text-gray-400">COINED ONE can make mistakes. Please verify important financial information.</p>
      </div>
    </div>
  );
};

export default ChatInput;