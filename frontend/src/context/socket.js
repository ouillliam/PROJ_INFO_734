import io from 'socket.io-client';
import React from 'react';

export let socket = io("http://127.0.0.1:5000");
export const SocketContext = React.createContext();