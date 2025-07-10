// src/components/DynamicDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';

const DynamicDropdown = ({ 
  options, 
  value, 
  onChange,
  onCreate
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on input
  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={value || inputValue}
        onChange={e => {
          setInputValue(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder="Type or select..."
      />
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map(option => (
            <div
              key={option.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.name);
                setInputValue('');
                setIsOpen(false);
              }}
            >
              {option.name}
            </div>
          ))}
          
          {inputValue && !filteredOptions.some(opt => 
            opt.name.toLowerCase() === inputValue.toLowerCase()
          ) && (
            <div
              className="p-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onCreate(inputValue);
                setInputValue('');
                setIsOpen(false);
              }}
            >
              + Add "{inputValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicDropdown;