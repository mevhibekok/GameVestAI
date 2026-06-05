import React, { useState, useRef, useEffect } from 'react';

/**
 * SearchableSelect - Searchable dropdown component with flexible input support
 * Allows both selection from list and custom input (with fallback to 'Other' or first option)
 * 
 * Props:
 * - label: Form label
 * - id: Input ID
 * - value: Current value
 * - onChange: Change handler
 * - options: Array of available options
 * - placeholder: Placeholder text
 * - allowCustom: Allow custom input (default: false)
 * - fallbackValue: Fallback when unknown value provided (default: first option)
 */
export default function SearchableSelect({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Search or select...',
  allowCustom = false,
  fallbackValue = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Update filtered options when search term changes
  useEffect(() => {
    const filtered = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    // If custom input allowed and doesn't match any option
    if (allowCustom && inputValue && !options.includes(inputValue)) {
      onChange({ target: { id, value: inputValue } });
    } else if (options.includes(inputValue)) {
      onChange({ target: { id, value: inputValue } });
    }
  };

  const handleSelectOption = (option) => {
    onChange({ target: { id, value: option } });
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputBlur = () => {
    // If value doesn't exist in options and custom not allowed, clear or use fallback
    if (value && !options.includes(value) && !allowCustom) {
      const newValue = fallbackValue || (options.length > 0 ? options[0] : '');
      onChange({ target: { id, value: newValue } });
    }
  };

  const displayValue = value && options.includes(value) ? value : value || '';

  return (
    <div className="flex flex-col gap-stack-xs" ref={containerRef}>
      <label className="font-body-sm text-body-sm text-on-surface" htmlFor={id}>
        {label}
      </label>

      <div className="relative">
        {/* Input Field */}
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          autoComplete="off"
          className="bg-surface-container-lowest font-body-md text-body-md rounded-lg px-4 py-3 w-full transition-colors border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline pr-10"
        />

        {/* Dropdown Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-outline pointer-events-none">
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M6 8l4 4 4-4"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-low border border-outline-variant rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map(option => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left px-4 py-2 font-body-md text-body-md transition-colors ${
                        value === option
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : searchTerm && allowCustom ? (
              <div className="px-4 py-3 text-on-surface-variant text-body-md">
                <p className="mb-2">Use custom value: <strong>{searchTerm}</strong></p>
                <button
                  type="button"
                  onClick={() => handleSelectOption(searchTerm)}
                  className="w-full text-left px-3 py-2 bg-primary/20 hover:bg-primary/30 text-on-surface rounded transition-colors font-body-sm"
                >
                  ✓ Accept Custom Input
                </button>
              </div>
            ) : (
              <div className="px-4 py-3 text-on-surface-variant text-body-md text-center">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      {allowCustom && (
        <p className="font-label-sm text-label-sm text-on-surface-variant/70 mt-1">
          Type to search or enter custom value
        </p>
      )}
    </div>
  );
}
