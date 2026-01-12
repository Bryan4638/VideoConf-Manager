import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  error,
  placeholder = 'Select options...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected options objects
  const selectedOptions = options.filter(option => 
    selectedValues.includes(option.value)
  );

  // Available options (not already selected)
  const availableOptions = options.filter(option => 
    !selectedValues.includes(option.value)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemoveOption = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Selected items display */}
        <div
          className={`bg-white border rounded-md shadow-sm min-h-10 p-1 flex flex-wrap gap-1 cursor-pointer ${
            isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'
          } ${error ? 'border-red-300' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <div 
                key={option.value}
                className="bg-blue-100 text-blue-800 text-sm rounded-md px-2 py-0.5 flex items-center"
              >
                {option.label}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(option.value);
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500 py-1 px-2">{placeholder}</span>
          )}
        </div>
        
        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-gray-300 overflow-auto">
            {availableOptions.length > 0 ? (
              availableOptions.map(option => (
                <div
                  key={option.value}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm"
                  onClick={() => handleToggleOption(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            )}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MultiSelect;