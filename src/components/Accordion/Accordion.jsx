import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({title,children,defaultOpen = true,className = ""}) => {

    const [isOpen, setIsOpen] = useState(defaultOpen);


    const toggleAccordion = () => {
        setIsOpen((prev) => !prev);
    };


    return (
        <div
            className={`
                accordion
                ${isOpen ? "accordion-open" : ""}
                ${className}
            `}
        >

            <button
                type="button"
                className="accordion-header"
                onClick={toggleAccordion}
                aria-expanded={isOpen}
            >

                {/* ARROW FIRST */}

                <span className="accordion-arrow">
                    {isOpen ? "-" : "+"}
                </span>


                {/* TITLE SECOND */}

                <span className="accordion-title">
                    {title}
                </span>

            </button>


            <div className="accordion-content">

                <div className="accordion-content-inner">

                    {children}

                </div>

            </div>

        </div>
    );
};

export default Accordion;