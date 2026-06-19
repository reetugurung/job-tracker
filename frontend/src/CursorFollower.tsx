import { useState, useEffect } from 'react';

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 text-2xl transition-all duration-75 ease-out select-none"
      style={{
        left: `${position.x + 10}px`, 
        top: `${position.y + 10}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      👾 
    </div>
  );
}