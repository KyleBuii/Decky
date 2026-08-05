import { memo, useState } from 'react';
import CardSlot from './CardSlot';

const Game = () => {
    const [scoreOponent, setScoreOponent] = useState(0);
    const [scorePlayer, setScorePlayer] = useState(0);

    return (
        <section className='game black-jack-21'>
            <CardSlot name='BEGIN'/>
            <CardSlot/>
            <CardSlot/>
            <CardSlot/>
            <CardSlot/>
            <section className='score'>
                <span>{scoreOponent}</span>
                <span>{scorePlayer}</span>
            </section>
        </section>
    );
};

export default memo(Game);