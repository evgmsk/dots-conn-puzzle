import React, { useEffect, useState } from 'react';

const socket = {connection: null as any}
let interval = 1000

const WebSocketClient = (): JSX.Element => {
    const [update, setUpdate] = useState(0)
    const handleMessage = (message: string) => {

    }
    useEffect(() => {
        if (!socket.connection) {
            connect(); // Attempt to connect on component mount
        }
        return () => {
            // Close the WebSocket connection when the component unmounts
            if (socket.connection) {
                socket.connection.close();
            }
        };
    }, [update]);

    const connect = () => {
        const ws = new WebSocket('ws://localhost:5000')
        ws.onopen = () => {
            console.log('WebSocket connected');
            socket.connection = ws; // Store the WebSocket object in state
            interval = 1000
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            handleMessage(event.data)
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            socket.connection = null; // Remove the WebSocket object from state
            interval = (interval * 2) % 30000
            setUpdate((update + 1) % 3)
        };
    };

    return <></>
};

export default WebSocketClient;
