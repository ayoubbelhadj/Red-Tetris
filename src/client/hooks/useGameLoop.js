import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FAST_GRAVITY_MS, GRAVITY_MS, SOFT_DROP_MS } from '../../shared/constants.js';
import { tick } from '../store/gameSlice.js';

// drives the piece's automatic fall via a setInterval tick, sped up by
// "gravity" mode or soft drop
export const useGameLoop = (active) => {
    const dispatch = useDispatch();
    const softDrop = useSelector((state) => state.game.softDrop);
    const mode = useSelector((state) => state.game.mode);

    useEffect(() => {
        if (!active)
            return undefined;
        const gravity = mode === 'gravity' ? FAST_GRAVITY_MS : GRAVITY_MS;
        const ms = softDrop ? SOFT_DROP_MS : gravity;
        const id = setInterval(() => dispatch(tick()), ms);
        return () => clearInterval(id);
    }, [active, softDrop, mode, dispatch]);
};
