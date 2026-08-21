import { memo, useRef, useState } from 'react';

const ChipStorage = () => {
    const [storagePosition, setStoragePosition] = useState([0, 0]);

    const refMousePosition = useRef([0, 0]);
    const refStartPosition = useRef([0, 0]);
    const refChipStorage = useRef(null);
    const refIsDragging = useRef(false);

    const handleMouseDown = (event) => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        refChipStorage.current.style.cursor = 'grabbing';
        refIsDragging.current = true;
        refMousePosition.current = [event.clientX, event.clientY];
        refStartPosition.current = [...storagePosition];
    };

    const handleMouseUp = () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refChipStorage.current.style.cursor = 'grab';
        refIsDragging.current = false;
    };

    const handleMouseMove = (event) => {
        if (!refIsDragging.current) return;

        const deltaX = event.clientX - refMousePosition.current[0];
        const deltaY = event.clientY - refMousePosition.current[1];

        const posX = refStartPosition.current[0] + deltaX;
        const posY = refStartPosition.current[1] + deltaY;

        setStoragePosition([posX, posY]);
    };

    return (
        <section ref={refChipStorage}
            className='chip-storage'
            style={{ transform: `translate(${storagePosition[0]}px, ${storagePosition[1]}px)` }}
            onMouseDown={handleMouseDown}>
        </section>
    );
};

export default memo(ChipStorage);