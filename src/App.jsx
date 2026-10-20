import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';



function App() {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [isAuthorized, setAuthorized] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();
    if (idInstance.trim() !== '' && apiTokenInstance.trim() !== '') {
      setAuthorized(true);
    } else {
      alert('Пожалуйста, введите данные в оба поля!');
    }
  }

  return (
    <div className='auth-wrapper'>
      {/* Если пользователь не авторизован показываем ему окно входа */}
      {!isAuthorized ? (
        <div className='auth-card'>
          <h2 className='auth-title'>Ввод в GREEN-API</h2>

          <form className='auth-form' onSubmit={handleLogin}>
            <input
            type='text'
            placeholder='Введите idInstance'
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            className='auth-input'
            />
            <input
            type='text'
            placeholder='Введите apiTokenInstance'
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            className='auth-input'
            />
            <button type='submit' className='auth-btn'>
              ВОЙТИ В ЧАТ
            </button>
          </form>
        </div> 
      ) : (
        // Иначе если авторизован - показываем интерфейс чата
        <div className='telegram-main'>
          {/* подключаем левую панель */}
          <Sidebar setActiveChat={setActiveChat} activeChat={activeChat}/>
          
          {/* правая */}
          <ChatWindow idInstance={idInstance} apiTokenInstance={apiTokenInstance} activeChat={activeChat}/>
        </div>
      )}
    </div>
  );
}

export default App;