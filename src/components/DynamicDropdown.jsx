// src/components/DynamicDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';

const DynamicDropdown = ({ 
  options, 
  value, 
  onChange,
  onCreate,
  onDelete, // New prop for deleting options
  onEdit // New prop for editing options
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingOption, setEditingOption] = useState(null); // Track the option being edited
  const [editValue, setEditValue] = useState(''); // Track the edited value
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
        setEditingOption(null); // Reset editing state
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle edit initiation
  const handleEditClick = (option) => {
    setEditingOption(option);
    setEditValue(option.name);
  };

  // Handle edit submission
  const handleEditSubmit = (optionId) => {
    if (editValue.trim()) {
      onEdit(optionId, editValue); // Call parent handler to update option
      setEditingOption(null);
      setEditValue('');
    }
  };

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
              className="flex items-center p-2 hover:bg-gray-100"
            >
              {editingOption?.id === option.id ? (
                <div className="flex w-full items-center">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-1 border rounded-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSubmit(option.id);
                      if (e.key === 'Escape') setEditingOption(null);
                    }}
                  />
                  <button
                    onClick={() => handleEditSubmit(option.id)}
                    className="ml-2 text-green-500 hover:text-green-700"
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingOption(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Cancel"
                  >
                    ✗
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="flex-grow cursor-pointer"
                    onClick={() => {
                      onChange(option.name);
                      setInputValue('');
                      setIsOpen(false);
                    }}
                  >
                    {option.name}
                  </div>
                  <button
                    onClick={() => handleEditClick(option)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onDelete(option.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    🗑
                  </button>
                </>
              )}
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