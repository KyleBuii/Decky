import { memo, useRef } from 'react';

const CardSlot = ({ name = '', currentDragged = null }) => {
    const refSlot = useRef(null);

    const handleMouseMove = (event) => {
        if (!currentDragged) return;

        const rectCurrentDragged = currentDragged.current.getBoundingClientRect();
        const deltaX = event.clientX - rectCurrentDragged.x;
        const deltaY = event.clientY - rectCurrentDragged.y;

        const refSlot = refSlot.current.getBoundingClientRect();
        const posX = refSlot.x + deltaX;
        const posY = refSlot.y + deltaY;

        refDeckPosition.current = [posX, posY];
        event.currentTarget.style.transform = `translate(${posX}px, ${posY}px)`;

        // if (refIsClick.current && ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5))) {
        //     refIsDragging.current = true;
        //     refIsClick.current = false;
        // };
    };

    return (
        <section ref={refSlot}
            className='slot'
            onMouseMove={handleMouseMove}>
            {(name !== '')
                ? <span>{name}</span>
                : <></>}
        </section>
    );
};

export default memo(CardSlot);