import { memo, useEffect, useRef } from 'react';

const CardSlot = ({ slot, startGame, isHolder = false, name = '' }) => {
    const refSlot = useRef(null);

    return (
        <section ref={refSlot}
            className={`slot ${(isHolder) ? 'holder' : ''}`}>
            {(name !== '')
                ? <span>{name}</span>
                : <></>}
        </section>
    );
};

export default memo(CardSlot);