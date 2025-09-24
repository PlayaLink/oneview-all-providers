import React, { useState, useEffect, useRef } from 'react';
import { ICellEditorParams, ICellEditorComp } from 'ag-grid-community';

interface DropdownCellEditorProps extends ICellEditorParams {
  options?: string[];
  isMultiSelect?: boolean;
}

const DropdownCellEditor: React.FC<DropdownCellEditorProps> = (props) => {
  console.log('DropdownCellEditor initialized with props:', {
    value: props.value,
    options: props.options,
    isMultiSelect: props.isMultiSelect,
    optionsLength: props.options?.length || 0
  });
  
  const [value, setValue] = useState<string | string[]>(props.value || (props.isMultiSelect ? [] : ''));
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = props.options || [];

  useEffect(() => {
    // Focus the input when the editor starts
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    // Handle clicks outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    if (props.isMultiSelect) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option)
        ? currentValue.filter(v => v !== option)
        : [...currentValue, option];
      setValue(newValue);
    } else {
      setValue(option);
      setIsOpen(false);
      // For single select, we can stop editing immediately
      props.stopEditing();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (!props.isMultiSelect) {
        props.stopEditing();
      }
    } else if (event.key === 'Escape') {
      props.stopEditing();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const getDisplayValue = () => {
    if (props.isMultiSelect) {
      return Array.isArray(value) ? value.join(', ') : '';
    }
    return value as string;
  };

  const getSelectedOptions = () => {
    if (props.isMultiSelect) {
      return Array.isArray(value) ? value : [];
    }
    return [];
  };

  // This method is required by AG Grid
  const getValue = () => {
    return value;
  };

  // This method is required by AG Grid
  const isCancelBeforeStart = () => {
    return false;
  };

  // This method is required by AG Grid
  const isCancelAfterEnd = () => {
    return false;
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative w-full h-full"
      data-testid="dropdown-cell-editor"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <input
        ref={inputRef}
        type="text"
        value={getDisplayValue()}
        onChange={(e) => setValue(e.target.value)}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        className="w-full h-full px-2 border-none outline-none bg-transparent"
        data-testid="dropdown-input"
        aria-label={`Select ${props.isMultiSelect ? 'multiple' : 'single'} option`}
      />
      
      {isOpen && options.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
          data-testid="dropdown-options"
          role="listbox"
          aria-label="Options"
        >
          {options.map((option, index) => {
            const isSelected = props.isMultiSelect 
              ? getSelectedOptions().includes(option)
              : value === option;
            
            return (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  isSelected ? 'bg-blue-50 text-blue-700' : ''
                }`}
                data-testid={`dropdown-option-${index}`}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option}</span>
                {props.isMultiSelect && isSelected && (
                  <span className="text-blue-600" aria-hidden="true">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// AG Grid requires the component to have these methods
(DropdownCellEditor as any).prototype.getValue = function() {
  return this.state?.value;
};

(DropdownCellEditor as any).prototype.isCancelBeforeStart = function() {
  return false;
};

(DropdownCellEditor as any).prototype.isCancelAfterEnd = function() {
  return false;
};

export default DropdownCellEditor;
