import { forwardRef, memo, useRef } from 'react';

const CardSlot = forwardRef(({ slot, click, isHolder = false, name = '' }, ref) => {
    const handleClick = () => {
        if (!click) return;

        click();
    };

    return (
        <section ref={ref}
            className={`slot ${(isHolder) ? 'holder' : ''}`}
            onClick={handleClick}>
            {(name !== '')
                ? <span>{name}</span>
                : <></>}
        </section>
    );
});

export default memo(CardSlot);