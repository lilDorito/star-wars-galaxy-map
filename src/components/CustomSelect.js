import { useState, useEffect, useRef } from "react";
import useClickSound from './PlaySound';

export default function CustomSelect({
  options = [],
  placeholder = "Select an option",
  onSelect,
  isOpen,
  onOpen,
}) {
  const [selected, setSelected] = useState("");
  const ref = useRef();
  const playOpenSound = useClickSound('/sounds/button_click.mp3', 0.6, 500);

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.keys(options);

  const handleSelect = (value) => {
    setSelected(value);
    onSelect?.(value);
    onOpen(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOpen(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpen, isOpen]);

  return (
    <div className="relative w-full max-w-sm" ref={ref}>
      <div
        className="px-4 py-2 bg-gradient-to-br from-gray-900 to-black bg-opacity-70 border-2 border-yellow-600 rounded-lg text-yellow-400 cursor-pointer select-none text-center font-medium hover:text-yellow-300 hover:border-yellow-500 transition-colors duration-200"
        onClick={() => {
          if (!isOpen) {
            playOpenSound();
          }
          onOpen(isOpen ? null : placeholder);
        }}
      >
        {selected || placeholder}
        <span className="float-right">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <ul className="custom-scrollbar absolute z-10 w-full mt-2 bg-gradient-to-br from-gray-900 to-black bg-opacity-90 border-2 border-yellow-600 rounded-lg shadow-2xl p-0 m-0 list-none max-h-60 overflow-auto">
          {normalizedOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 cursor-pointer font-bold text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors duration-150"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
