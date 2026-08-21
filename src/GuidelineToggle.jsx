import { memo, useRef, useState } from 'react';

const GuidelineToggle = ({ isGuidelines, updateIsGuidelines }) => {
    const [guidelinePosition, setGuidelinePosition] = useState([0, 0]);

    const refMousePosition = useRef([0, 0]);
    const refStartPosition = useRef([0, 0]);
    const refGuidelineToggle = useRef(null);

    const refIsMouseClick = useRef(false);  /// If card was clicked
    const refIsDragging = useRef(false);    /// If card is dragging
    const refIsClick = useRef(false);       /// If card is clicked

    const handleMouseDown = (event) => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        refGuidelineToggle.current.style.cursor = 'grabbing';
        
        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        refMousePosition.current = [event.clientX, event.clientY];
        refStartPosition.current = [...guidelinePosition];
    };

    const handleMouseUp = (event) => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refGuidelineToggle.current.style.cursor = 'grab';

        refIsMouseClick.current = false;
        refIsDragging.current = false;

        if (refIsClick.current) handleClick(event);
    };

    const handleMouseMove = (event) => {
        if (!refIsMouseClick.current) return;

        const deltaX = event.clientX - refMousePosition.current[0];
        const deltaY = event.clientY - refMousePosition.current[1];

        if ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5)) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;
        
        const posX = refStartPosition.current[0] + deltaX;
        const posY = refStartPosition.current[1] + deltaY;
        
        setGuidelinePosition([posX, posY]);
    };

    const handleClick = () => {
        refIsClick.current = false;
        updateIsGuidelines(!isGuidelines);
        refGuidelineToggle.current.classList.toggle('on');
    };

    return (
        <section ref={refGuidelineToggle}
            className='guideline-toggle'
            style={{ transform: `translate(${guidelinePosition[0]}px, ${guidelinePosition[1]}px)` }}
            onMouseDown={handleMouseDown}>
            <div className='bulb'></div>
            <div className='base'>
                <span className='stripe'></span>
                <span className='stripe'></span>
                <span className='stripe'></span>
                <span className='tip'></span>
            </div>
        </section>
    );
};

export default memo(GuidelineToggle);