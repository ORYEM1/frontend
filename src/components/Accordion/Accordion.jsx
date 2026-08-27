import React from 'react'
import "./Accordion.css";

const Accordion = ({title,children,defaultOpen=true}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);
    const toggleAccordion = ()=>{
        setIsOpen((prev)=> !prev);
    };
  return (
    <div className={`accordion ${isOpen ? "accordion-open": ""}`}>
        <button type='button'
        className='accordion-header'
        onClick={toggleAccordion}
        aria-expanded={isOpen}>
            <span className='accordion-title'>
                {title}
            </span>
            <span className='accordion-arrow'>
                {isOpen ? "-":"+" }

            </span>

        </button>
        <div className="accordion-content">
            <div className="accordion-inner">
                {children}
            </div>
        </div>

    </div>
  );
};

export default Accordion;