import React, { useState } from "react";
import { Wheel } from 'react-custom-roulette';

const SimpleReactRoulette = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // Simple test data
  const data = [
    { option: 'Prize 1', style: { backgroundColor: '#ff0000', textColor: '#ffffff' } },
    { option: 'Prize 2', style: { backgroundColor: '#00ff00', textColor: '#ffffff' } },
    { option: 'Prize 3', style: { backgroundColor: '#0000ff', textColor: '#ffffff' } },
    { option: 'Prize 4', style: { backgroundColor: '#ffff00', textColor: '#000000' } },
  ];

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        onStopSpinning={() => {
          setMustSpin(false);
          console.log('Won:', data[prizeNumber].option);
        }}
      />
      <button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
      >
        {mustSpin ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
};

export default SimpleReactRoulette;