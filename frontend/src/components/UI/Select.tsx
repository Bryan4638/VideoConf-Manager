import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple'> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  const baseClasses = 'block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
  const errorClasses = error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseClasses} ${errorClasses} ${widthClass} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;