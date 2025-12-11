import React from 'react';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full h-full max-w-screen-2xl bg-white shadow-2xl overflow-hidden relative">
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;