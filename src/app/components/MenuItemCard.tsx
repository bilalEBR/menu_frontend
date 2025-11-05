'use client'; 

import React, { useState, useEffect } from 'react'; // 1. Import useEffect

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  showCounter?: boolean; 
}

function MenuItemCard({ name, price, description, showCounter = true }: MenuItemProps) {
  
  // STATE: Manages the internal count (Lesson 5)
  const [itemCount, setItemCount] = useState<number>(0);

  // EFFECT: Runs whenever 'itemCount' changes
  useEffect(() => {
    // 2. The function inside runs every time the component re-renders
    // AND the value in the dependency array changes.
    if (itemCount > 0) {
      console.log(`[EFFECT] Added ${name}. Total quantity: ${itemCount}`);
    } else if (itemCount === 0 && name) {
      console.log(`[EFFECT] ${name} quantity reset to 0.`);
    }
    
    // 3. Dependency Array: The effect will re-run whenever this value changes.
  }, [itemCount, name]); // We include 'name' because we use it in the console.log

  // 4. State handlers (same as before)
  const handleAdd = () => setItemCount(itemCount + 1);
  const handleRemove = () => {
    if (itemCount > 0) {
      setItemCount(itemCount - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
      
      <h2 className="text-xl font-serif font-bold text-gray-800 mb-1">{name}</h2>
      <p className="text-2xl font-mono text-blue-600 mb-3">${(price || 0).toFixed(2)}</p>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      {showCounter && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-700 font-medium">Quantity:</p>
          <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-full border">
            <button onClick={handleRemove} className="..." disabled={itemCount === 0}>−</button>
            <span className="text-xl font-mono w-6 text-center">{itemCount}</span>
            <button onClick={handleAdd} className="...">+</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuItemCard;
