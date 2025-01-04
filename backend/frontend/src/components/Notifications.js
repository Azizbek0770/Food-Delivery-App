import React, { useEffect, useState } from 'react';

const Notifications = () => {
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetch(`/api/notifications/?type=${filter}`)
            .then((res) => res.json())
            .then((data) => setMessages(data));
    }, [filter]);

    return (
        <div>
            <h2>Notifications</h2>
            <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                <option value="">All</option>
                <option value="order_update">Order Updates</option>
                <option value="system_message">System Messages</option>
                <option value="promotion">Promotions</option>
            </select>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>{msg.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
