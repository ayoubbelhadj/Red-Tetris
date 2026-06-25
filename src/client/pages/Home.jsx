import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NAME_RE = /^[\w-]{1,16}$/;

export const Home = () => {
    const navigate = useNavigate();
    const [room, setRoom] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const submit = () => {
        if (!NAME_RE.test(room) || !NAME_RE.test(name)) {
            setError('Room and name: 1-16 letters, digits, _ or -');
            return;
        }
        navigate(`/${room}/${name}`);
    };

    const onKeyDown = (event) => {
        if (event.key === 'Enter') submit();
    };

    return (
        <main className="home">
            <h1 className="logo">
                RED<span className="logo-accent">_</span>TETRIS
            </h1>
            <p className="tagline">last stack standing</p>

            <div className="join-card">
                <label className="field">
                    <span>Room</span>
                    <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="galaxy"
                        autoFocus
                    />
                </label>
                <label className="field">
                    <span>Player name</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="ayoub"
                    />
                </label>
                {error && <p className="error-text">{error}</p>}
                <button type="button" className="btn" onClick={submit}>
                    Join room
                </button>
                <p className="hint">
                    or open <code>/&lt;room&gt;/&lt;player_name&gt;</code> directly
                </p>
            </div>
        </main>
    );
};
