import { memo, useRef, useState } from 'react';

const Card = ({ label, suit, suitsMiddle, color, art = '' }) => {
    const [cardPrevPosition, setCardPrevPosition] = useState([0, 0]);
    const refIsMouseClick = useRef(false);
    const refIsDragging = useRef(false);
    const refIsClick = useRef(false);

    const handleCardClick = (event) => {
        refIsClick.current = false;

        const cardInner = event.currentTarget.firstChild;
        if (cardInner.style.transform === 'unset') {
            event.currentTarget.firstChild.style.transform = 'rotateY(180deg)';
        } else {
            event.currentTarget.firstChild.style.transform = 'unset';
        };
    };
    
    const handleMouseUp = (event) => {
        refIsMouseClick.current = false;
        refIsDragging.current = false;
        if (refIsClick.current) handleCardClick(event);
    };

    const handleMouseDown = (event) => {
        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;
        setCardPrevPosition([event.clientX, event.clientY]);
    };

    const handleMouseMove = (event) => {
        const positionDiffX = Math.abs(event.clientX - cardPrevPosition[0]);
        const positionDiffY = Math.abs(event.clientY - cardPrevPosition[1]);

        if (refIsMouseClick.current && ((positionDiffX > 5) || (positionDiffY > 5))) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;

        const card = event.currentTarget;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const posX = event.clientX - (cardWidth / 2);
        const posY = event.clientY - (cardHeight / 2);
        card.style.transform = `translate(${posX}px, ${posY}px)`;
    };

    const handleMouseLeave = (event) => {
        refIsDragging.current = false;
    };

    return (
        <section className='card-container'
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            <div className='card-container-inner'>
                <div className={`card front ${color} ${art === '' ? '' : art}`}>
                    <div className='card-label left'>
                        <span>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: suit }}></span>
                    </div>
                    <div className='card-center'>
                        {(art === '')
                            ? suitsMiddle.map((suitNum) => {
                                return <span dangerouslySetInnerHTML={{ __html: suit }}
                                    className={suitNum}
                                    key={`${label} suit ${suitNum} ${art}`}></span>
                            })
                            : <></>
                        }
                    </div>
                    <div className='card-label right'>
                        <span>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: suit }}></span>
                    </div>
                </div>
                <div className={`card back ${color}`}></div>
            </div>
        </section>
    );
};

export default memo(Card);