import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    hardDrop,
    moveLeft,
    moveRight,
    rotate,
    setSoftDrop,
} from '../store/gameSlice.js';

// preventDefault stops arrows/space from scrolling the page;
// rotate/hardDrop ignore key-repeat so holding the key doesn't spam them
export const useKeyboard = (active) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!active)
            return undefined;

        const onKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    dispatch(moveLeft());
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    dispatch(moveRight());
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!event.repeat) dispatch(rotate());
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    dispatch(setSoftDrop(true));
                    break;
                case ' ':
                    event.preventDefault();
                    if (!event.repeat) dispatch(hardDrop());
                    break;
                default:
                    break;
            }
        };

        const onKeyUp = (event) => {
            if (event.key === 'ArrowDown')
                dispatch(setSoftDrop(false));
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [active, dispatch]);
};
