"use client";

import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChat && selectedChat.messages.length > 0) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  const hasMessages = selectedChat && selectedChat.messages.length > 0;

  return (
    <div>
      <div className="flex h-screen">
        {/* ---sidebar--- */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col bg-[#292a2d] text-white relative">
          {/* Mobile header */}
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full z-10">
            <Image
              onClick={() => {
                expand ? setExpand(false) : setExpand(true);
              }}
              className="rotate-180 cursor-pointer"
              src={assets.menu_icon}
              alt="Menu"
            />
            <Image className="opacity-70" src={assets.chat_icon} alt="Chat" />
          </div>

          {/* Main content area */}
          <div className={`flex-1 flex flex-col ${hasMessages ? 'justify-start' : 'justify-center'} items-center px-4 pt-16 md:pt-8`}>
            
            {/* Welcome message when no chat is selected */}
            {!hasMessages && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <Image src={assets.logo_icon} alt="Logo" className="h-16" />
                  <p className="text-2xl font-medium">Hi, I&apos;m Patent Pilot.</p>
                </div>
                <p className="text-sm mt-2">How can I help you today?</p>
              </div>
            )}

            {/* Messages container */}
            {hasMessages && (
              <div 
                ref={messagesContainerRef}
                className="w-full max-w-4xl flex-1 overflow-y-auto pb-4 custom-scrollbar"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              >
                <div className="space-y-4">
                  {selectedChat.messages.map((message, index) => (
                    <Message 
                      key={index} 
                      role={message.role} 
                      content={message.content}
                      patents={message.patents} // Add this line
                    />
                  ))}
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-center items-center py-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white/60"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Prompt box - always at bottom */}
          <div className="flex justify-center px-4 pb-8">
            <PromptBox setisLoading={setisLoading} isLoading={isLoading} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}