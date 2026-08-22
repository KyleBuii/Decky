import { memo, useRef } from 'react';

const CardSlot = ({ currentDragged, updateDraggedPosition, isHolder = false, name = '' }) => {
    const refSlot = useRef(null);

    const handleClick = (event) => {
        if (!currentDragged?.current) return;

        const rectSlot = refSlot.current.getBoundingClientRect();
        updateDraggedPosition(rectSlot.x, rectSlot.y);
    };

    return (
        <section ref={refSlot}
            className={`slot ${(isHolder) ? 'holder' : ''}`}
            onClick={handleClick}>
            {(name !== '')
                ? <span>{name}</span>
                : <></>}
        </section>
    );
};

export default memo(CardSlot);