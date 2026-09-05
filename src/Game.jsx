import { memo, useRef, useState } from 'react';
import CardSlot from './CardSlot';

const Game = ({ moveDeck }) => {
    const [gamePosition, setGamePosition] = useState([-34, 110]);
    const [slottedCards, setSlottedCards] = useState({});
    const [scoreOponent, setScoreOponent] = useState(0);
    const [scorePlayer, setScorePlayer] = useState(0);

    const refSlotBegin = useRef(null);

    const startGame = () => {
        const rectSlotBegin = refSlotBegin.current.getBoundingClientRect();
        moveDeck(rectSlotBegin.left, rectSlotBegin.top);
    };

    return (
        <section className='game black-jack-21'
            style={{ transform: `translate(${gamePosition[0]}px, ${gamePosition[1]}px)` }}>
            <CardSlot isHolder={true}
                name='HOLDER'/>
            <CardSlot ref={refSlotBegin}
                name='BEGIN'
                click={startGame}/>
            <CardSlot slot={1}/>
            <CardSlot slot={2}/>
            <CardSlot slot={3}/>
            <CardSlot slot={4}/>
            <section className='score'>
                <span>{scoreOponent}</span>
                <span>{scorePlayer}</span>
            </section>
        </section>
    );
};

export default memo(Game);