import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Game } from '../components/Game.jsx';
import { joinRoom, leaveRoom } from '../store/socketActions.js';

// mounting joins the room from the URL params, unmounting leaves it;
// socket logic itself lives in the middleware
export const GameRoom = () => {
    const { room, playerName } = useParams();
    const dispatch = useDispatch();
    const { joined, error } = useSelector((state) => state.room);
u
    useEffect(() => {
        dispatch(joinRoom({ room, name: playerName }));
        return () => dispatch(leaveRoom());
    }, [dispatch, room, playerName]);

    if (error) {
        return (
            <main className="centered">
                <h2 className="error-title">Cannot join</h2>
                <p className="error-text">{error}</p>
                <Link className="btn" to="/">
                    Back home
                </Link>
            </main>
        );
    }

    if (!joined) {
        return (
            <main className="centered">
                <p className="muted">Connecting to {room}…</p>
            </main>
        );
    }

    return <Game />;
};
