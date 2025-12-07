import React from 'react';

interface DonationCounterProps {
  amount: number;
}

const DonationCounter: React.FC<DonationCounterProps> = ({ amount }) => {
  // Format currency: Rs. 1,000,000
  const formattedAmount = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
  }).format(amount);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center shadow-lg transform transition-all duration-500 hover:scale-105">
      <p className="text-combank-yellow uppercase tracking-widest text-xs font-semibold mb-1">Total Pledged So Far</p>
      <div className="text-3xl md:text-5xl font-bold text-white font-serif drop-shadow-md">
        {formattedAmount}
      </div>
    </div>
  );
};

export default DonationCounter;