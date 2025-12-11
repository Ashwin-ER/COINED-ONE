import React from 'react';
import { Message, Role } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-teal-600 shadow-sm'}`}>
          {isUser ? <User size={16} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div 
          className={`
            px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-teal-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }
          `}
        >
          {/* Simple whitespace handling for paragraphs */}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;