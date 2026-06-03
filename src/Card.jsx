import { memo, useRef } from 'react';

const Card = ({ label, suit, suitsMiddle, color, art = '' }) => {
    const refIsDragging = useRef(false);

    const handleCardClick = (event) => {
        if (refIsDragging.current) return;

        const cardInner = event.currentTarget.firstChild;
        if (cardInner.style.transform === 'unset') {
            event.currentTarget.firstChild.style.transform = 'rotateY(180deg)';
        } else {
            event.currentTarget.firstChild.style.transform = 'unset';
        };
    };
    
    const handleMouseUp = (event) => {
        refIsDragging.current = false;
    };

    const handleMouseDown = (event) => {
        refIsDragging.current = true;
    };

    const handleMouseMove = (event) => {
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
            onClick={handleCardClick}
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