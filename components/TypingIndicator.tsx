import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1.5 p-2 bg-gray-100 rounded-2xl rounded-tl-none w-fit items-center h-10">
      <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
    </div>
  );
};

export default TypingIndicator;