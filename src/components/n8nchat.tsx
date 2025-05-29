'use client';

import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const N8nChat = () => {
  useEffect(() => {
    createChat({
      webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '',
      webhookConfig: {
        method: 'POST',
        headers: {},
      },
    //   mode: 'window',
      mode:'fullscreen',
      target: '#n8n-chat',
      chatInputKey: 'chatInput',
      metadata: {},
      showWelcomeScreen: false,
      defaultLanguage: 'en',
      initialMessages: [
        'Hello Traders! 👋',
        'My name is OptionXI. How can I assist you today?',
      ],
    });
  }, []);

  return (
    <div id="n8n-chat" className='p-2'>
      {/* The chat will stay constrained inside this container */}
    </div>
  );
};

export default N8nChat;
