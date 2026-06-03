import { memo } from 'react';
import Deck from './Deck';

const App = () => {
    return (
        <section>
            <section className='deck-templates'></section>
            <section className='decks'>
                <Deck/>
            </section>
        </section>
    );
};

export default memo(App);