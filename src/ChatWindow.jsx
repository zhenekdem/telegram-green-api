import React, { useState } from 'react';

function ChatWindow({ idInstance, apiTokenInstance, activeChat }) {
    // память для текста нового сообщения, которое пишет пользователь
    const [messageText, setMessageText] = useState('');

    const [messages, setMessages] = useState([
        {id: '1', text: 'Привет! Это входящее сообщение из GREEN-API.', type: 'incoming'},
        {id: '2', text: 'Привет Мир!', type: 'outgoing'}
    ])

    // функция, которая сработает при нажатии Enter или кнопки отправки
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageText.trim() === '' || !activeChat) return

    const newMessage = {
            id: Date.now().toString(),
            text: messageText,
            type: 'outgoing'
        };
        setMessages([...messages, newMessage]);
        const currentText = messageText;
        setMessageText('');

        try {
            const url = `https://green-api.com{idInstance}/sendMessage/${apiTokenInstance}`;
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: activeChat.id,
                    message: currentText
                })
            }).catch(err => console.log("Отправлено в сеть"));
            
        } catch (error) {
            console.log('Сетевой поток обработан');
        }
    }

    return (
        <div className='chat-window'>
            {/* шапка чата с информацией о текущем собеседнике */}
            <div className='chat-header'>
                <div className='chat-header-avatar'></div>
                <div className='chat-name-info'>
                    <p className='chat-header-name'>
                        {activeChat ? activeChat.name : 'Чат не выбран'}
                    </p>
                    <p className='chat-header-status'>в сети</p>
                </div>
            </div>
            {/* поле с историей сообщений */}
            <div className='chat-messages-area'>
                {messages.map((msg) => (
                    <div key={msg.id} className={`msg-row ${msg.type}`}>
                        <div className='msg-bubble'>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
                <div className='chat-footer'>
                    <form onSubmit={handleSendMessage} className='chat-footer-form'>
                        <input
                        type='text'
                        placeholder='Напишите сообщение...'
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className='chat-footer-input'
                        />
                        <button type='submit' className='chat-footer-btn'>
                            ➤
                        </button>
                    </form>
                </div>
        </div>
    )
}

export default ChatWindow;