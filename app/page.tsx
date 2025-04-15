import React from 'react';
// Adjust import path for components
import { Chat } from '@/components/chat'; 
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';

export default async function Page() {
  const id = generateUUID();

  return (
    <>
      <Chat
        id={id}
        initialMessages={[]}
        selectedChatModel={DEFAULT_CHAT_MODEL}
        isReadonly={false} 
      />
    </>
  );
} 