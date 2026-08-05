import { memo, useRef } from 'react';

const CardSlot = ({ name = '' }) => {
    const refSlot = useRef(null);

    const handleMouseMove = (event) => {
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