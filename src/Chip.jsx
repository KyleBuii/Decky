import { memo } from 'react';

const Chip = ({ color }) => {
    return (
        <section className={`chip ${color}`}></section>
    );
};

export default memo(Chip);