import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export default function AsyncSelect({ 
  loadOptions, 
  value, 
  onChange, 
  placeholder = "Search...", 
  labelKey = "name",
  valueKey = "id",
  renderOption = null
}) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim().length === 0) {
        setOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await loadOptions(inputValue);
        setOptions(results || []);
        setIsOpen(true);
      } catch (err) {
        console.error("Failed to load options", err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, loadOptions]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (option) => {
    onChange(option);
    setInputValue('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <Search size={16} className="text-gray-400 mr-2" />
        
        {value ? (
          <div className="flex-1 flex items-center">
            <span className="flex-1 text-gray-900">{value[labelKey]}</span>
            <button 
              type="button" 
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder={placeholder}
            className="flex-1 border-none outline-none w-full text-gray-900 placeholder-gray-400 bg-transparent"
            onFocus={() => inputValue && setIsOpen(true)}
          />
        )}
        
        {loading && <Loader2 className="animate-spin text-primary ml-2" size={16} />}
      </div>

      {isOpen && options.length > 0 && !value && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {options.map((option) => (
            <div
              key={option[valueKey]}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-900 border-b border-gray-100 last:border-0 transition-colors"
            >
              {renderOption ? renderOption(option) : option[labelKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
