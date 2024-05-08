import React, { useState } from 'react';
import dropdownSVG from '../../../../assets/img/dropdown-arrow.svg';

interface DropdownProps {
  label: React.ReactNode;
  content: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, content }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(isDropdownOpen => !isDropdownOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleDropdown();
    }
  };

  return (
    <>
      <div
        className="cursor-pointer flex gap-4"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}>
        {label}
        <img
          alt="arrow"
          width={20}
          className={`contrast-100 transition-transform duration-300 ${isDropdownOpen && 'rotate-180'}`}
          src={dropdownSVG}
        />
      </div>
      {isDropdownOpen && <div className=" pl-4 mb-4">{content}</div>}
    </>
  );
};

export default Dropdown;
