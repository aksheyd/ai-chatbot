'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import { fetcher, generateUUID } from '@/lib/utils';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { toast } from 'sonner';

// Define mock messages
const mockMessages = [
  "This is the first mock response. I'm pretending to be an LLM!",
  "Here is the second predefined message. Isn't this fun?",
  "And this is the final mock message. Let's cycle back now.",
];

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  isReadonly: boolean;
}) {
  const [mockResponseIndex, setMockResponseIndex] = useState(0);

  const {
    messages,
    setMessages,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      console.log("Mock chat finished turn.");
    },
    onError: () => {
      console.error("useChat onError triggered - should not happen in mock mode");
    },
  });

  // Refactor: handleMockSubmit now takes a message string
  const handleMockSubmit = useCallback(async (message: string) => {
    if (!message) return;
    setInput('');
    await append({ role: 'user', content: message, id: generateUUID() });
    await new Promise(resolve => setTimeout(resolve, 500));
    const responseContent = mockMessages[mockResponseIndex];
    await append({ role: 'assistant', content: responseContent, id: generateUUID() });
    setMockResponseIndex(prevIndex => (prevIndex + 1) % mockMessages.length);
  }, [append, setInput, mockResponseIndex]);

  // Wrapper function to match the expected type for MultimodalInput's handleSubmit
  const handleSubmitForInput = useCallback(() => {
    handleMockSubmit(input);
  }, [handleMockSubmit, input]);

  const votes = undefined;
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl" onSubmit={e => { e.preventDefault(); handleMockSubmit(input); }}>
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmitForInput}
              status={status as any}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages as any}
              append={append as any}
            />
          )}
        </form>
      </div>
    </>
  );
}
