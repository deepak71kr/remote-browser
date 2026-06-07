import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const containerRef = useRef(null);

  const handleStartBrowser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/start-browser', { method: 'POST' });
      if (!response.ok) throw new Error("Failed to start container");

      const newSocket = io('http://localhost:8080');
      setSocket(newSocket);
      setIsStarted(true);

      newSocket.on('stream', (base64Image) => {
        setImageSrc(`data:image/png;base64,${base64Image}`);
      });

    } catch (error) {
      console.error(error);
      alert("Error starting browser. Make sure Docker and Orchestrator are running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStarted && containerRef.current) {
      // auto-focus the container so it can immediately receive keyboard events
      containerRef.current.focus();
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [isStarted, socket]);

  const handleMouseClick = (e) => {
    if (!socket) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    socket.emit('mouseClick', { x, y });
  };

  const handleKeyDown = (e) => {
    if (!socket) return;
    socket.emit('keyPress', e.key);
  };

  return (
    <div style={{ backgroundColor: '#222', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
      <h1 style={{ color: 'white', fontFamily: 'sans-serif' }}>Remote Browser</h1>
      
      {!isStarted && (
        <button 
          onClick={handleStartBrowser}
          disabled={isLoading}
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: isLoading ? '#555' : '#4CAF50', color: 'white', marginBottom: '1rem' }}
        >
          {isLoading ? 'Spinning up Docker Container...' : 'Start Browser'}
        </button>
      )}

      {isStarted && (
        <div 
          ref={containerRef}
          tabIndex="0"
          onKeyDown={handleKeyDown}
          style={{ border: '4px solid #555', borderRadius: '8px', overflow: 'hidden', width: '1024px', height: '768px', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', outline: 'none' }}
        >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Browser Stream" 
              onClick={handleMouseClick}
              style={{ width: '100%', height: '100%', cursor: 'crosshair' }} 
            />
          ) : (
            <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Connecting to stream...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;