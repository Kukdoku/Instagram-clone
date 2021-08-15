import React from 'react'
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessage from '../components/chat/ChatMessage';
import ChatMessageHeader from '../components/chat/ChatMessageHeader';
import ChatPerson from '../components/chat/ChatPerson';
import './chat.css';


function Chat() {
    return (
        <div className="chat">
        <div className="chat__left">
        <ChatHeader />
        <ChatPerson />

        </div>
        <div className="chat__right">
           <ChatMessageHeader />
           <ChatMessage />
        </div>
            {/* chat header */}
            {/* chat-person */}
            {/* chat-message-header */}
            {/* chat message */}
            {/* chat input */}
        </div>
    )
}

export default Chat
