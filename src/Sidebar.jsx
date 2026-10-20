import React, { useState } from 'react';

function Sidebar({ setActiveChat, activeChat }) {
    // Память для поля ввода номера телефона
    const [phoneNumber, setPhoneNumber] = useState('');

    // Функция, которая сработает при создании чата
    const handleCreateChat = (e) => {
        e.preventDefault();
        if (phoneNumber.trim() !== '') {
            const formattedChatId = `${phoneNumber.trim()}@c.us`;
            // записываем этот чат как активный в память приложения app.jsx
            setActiveChat({
                id: formattedChatId,
                name: `+${phoneNumber.trim()}`
            })
            setPhoneNumber(''); // очищаем поле ввода после создания
        } else {
            alert('Введите номер телефона получателя!');
        }
    }

    return (
        <div className='sidebar'>
            {/* верхняя часть: поиск и создание чата */}
            <div className='sidebar-header'>
                <form onSubmit={handleCreateChat} className='sidebar-form'>
                    <input 
                    type='text'
                    placeholder='Введите номер телефона...'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className='sidebar-input'
                    />
                    <button type='submit' className='sidebar-btn'>
                        +
                    </button>
                </form>
            </div>

            {/* нижняя часть: список активных чатов */}
            <div className='sidebar-chats'>
                {activeChat ? (
                <div className='chat-item active'>
                <div className='chat-avatar'></div>
                <div className='chat-info'>
                    <p className='chat-name'>{activeChat.name}</p>
                    <p className='chat-last-msg'>Чат открыт...</p>
                </div>
                </div>
                ) : (
                    <p className='sidebar-no-chats'>
                        Нет активных чатов
                    </p>
                )}
            </div>
        </div>
    )
}

export default Sidebar;