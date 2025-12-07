import React, { useMemo } from 'react';

const Snowfall: React.FC = () => {
  // Generate random snowflakes
  const snowflakes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: 0.4 + Math.random() * 0.5,
      // Sizes adjusted for text/emoji visibility (approx 10px to 22px)
      size: `${10 + Math.random() * 12}px`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white animate-snow select-none"
          style={{
            left: flake.left,
            top: '-30px',
            fontSize: flake.size,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            opacity: flake.opacity,
            lineHeight: 1,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;