import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';

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
            const url = `https://green-api.com${idInstance}/sendMessage/${apiTokenInstance}`;
            
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
     useEffect(() => {
        if (!idInstance || !apiTokenInstance || !activeChat) return;

        const receiveUrl = `https://green-api.com${idInstance}/receiveNotification/${apiTokenInstance}`;

        const checkIncomingMessages = async () => {
            try {
                const response = await fetch(receiveUrl);
                if (!response.ok) return;
                
                const notification = await response.json();
                
                // Если на сервере появилось новое сообщение
                if (notification && notification.receiptId) {
                    const typeBody = notification.body.typeWebhook;
                    
                    // Проверяем, что это именно текстовое сообщение от собеседника
                    if (typeBody === 'incomingMessageReceived') {
                        const incomingText = notification.body.messageData?.textMessageData?.textMessage;
                        const senderId = notification.body.senderData?.chatId;

                        // Если это сообщение пришло именно от того, с кем у нас сейчас открыт чат
                        if (incomingText && senderId === activeChat.id) {
                            const newIncomingMsg = {
                                id: notification.body.idMessage,
                                text: incomingText,
                                type: 'incoming' // Серый бабл слева
                            };
                            // Дописываем ответ собеседника в историю переписки на экран!
                            setMessages((prev) => [...prev, newIncomingMsg]);
                        }
                    }

                    const deleteUrl = `https://green-api.com${idInstance}/deleteNotification/${apiTokenInstance}/${notification.receiptId}`;
                    await fetch(deleteUrl, { method: 'DELETE' });
                }
            } catch (error) {
                console.log("Фоновая проверка сообщений...");
            }
        };

        const interval = setInterval(checkIncomingMessages, 5000);
        
        // Выключаем таймер, если пользователь закроет чат
        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance, activeChat]);

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