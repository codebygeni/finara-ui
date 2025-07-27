// src/components/Accordion.tsx
import React, { useRef, useEffect, useState } from 'react';
import './Accordion.css'; // Accordion specific CSS

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, isOpen, onToggle, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      // Set max-height to scrollHeight when open, 0 when closed
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen, children]); // Re-calculate if children change or isOpen changes

  return (
    <div className="accordion-container">
      <button className={`accordion-header ${isOpen ? 'open' : ''}`} onClick={onToggle}>
        {title}
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ maxHeight: maxHeight }}
      >
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;