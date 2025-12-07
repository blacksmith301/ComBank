import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-combank-dark/80 to-transparent">
      <img 
        src="https://www.combank.lk/assets/images/logo/newlogo.svg" 
        alt="Commercial Bank Logo" 
        className="h-12 md:h-16 drop-shadow-lg"
      />
      <div className="text-white text-right hidden sm:block">
        <h2 className="text-combank-yellow font-serif text-xl font-bold italic">Wish for the Nation</h2>
        <p className="text-sm opacity-90">Christmas Relief Drive 2025</p>
      </div>
    </header>
  );
};

export default Header;