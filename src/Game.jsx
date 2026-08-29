import { memo, useRef, useState } from 'react';
import CardSlot from './CardSlot';

const Game = ({ currentClickedCard }) => {
    const rectClickedCard = currentClickedCard.current.getBoundingClientRect();

    const [gamePosition, setGamePosition] = useState([rectClickedCard.x - 34, rectClickedCard.y + 110]);
    const [slottedCards, setSlottedCards] = useState({});
    const [scoreOponent, setScoreOponent] = useState(0);
    const [scorePlayer, setScorePlayer] = useState(0);

    const refMousePosition = useRef([0, 0]);
    const refStartPosition = useRef([0, 0]);
    const refDragger = useRef(null);
    const refIsDragging = useRef(false);

    const handleMouseDown = (event) => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        refDragger.current.style.cursor = 'grabbing';
        refIsDragging.current = true;
        refMousePosition.current = [event.clientX, event.clientY];
        refStartPosition.current = [...gamePosition];
    };

    const handleMouseUp = () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refDragger.current.style.cursor = 'grab';
        refIsDragging.current = false;
    };

    const handleMouseMove = (event) => {
        if (!refIsDragging.current) return;

        const deltaX = event.clientX - refMousePosition.current[0];
        const deltaY = event.clientY - refMousePosition.current[1];

        const posX = refStartPosition.current[0] + deltaX;
        const posY = refStartPosition.current[1] + deltaY;

        setGamePosition([posX, posY]);
    };

    const startGame = () => {

    };

    return (
        <section className='game black-jack-21'
            style={{ transform: `translate(${gamePosition[0]}px, ${gamePosition[1]}px)` }}>
            <CardSlot isHolder={true}
                name='HOLDER'/>
            <CardSlot name='BEGIN'
                startGame={startGame}/>
            <CardSlot slot={1}/>
            <CardSlot slot={2}/>
            <CardSlot slot={3}/>
            <CardSlot slot={4}/>
            <section ref={refDragger}
                className='score'
                onMouseDown={handleMouseDown}>
                <span>{scoreOponent}</span>
                <span>{scorePlayer}</span>
            </section>
        </section>
    );
};

export default memo(Game);