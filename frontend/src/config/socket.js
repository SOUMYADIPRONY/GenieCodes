import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });

    // Handle connection events
    // socketInstance.on('connect', () => {
    //     console.log('Socket connected');
    // });

    // socketInstance.on('connect_error', (error) => {
    //     console.error('Socket connection error:', error);
    // });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    // if (!socketInstance) {
    //     console.error('Socket not initialized. Call initializeSocket first.');
    //     return;
    // }

    // socketInstance.on(eventName, messageData=> {
    //     if (callback && typeof callback === 'function') {
    //         callback(messageData);
    //     }
    // });
     socketInstance.on(eventName, cb);

}

export const sendMessage = (eventName, message) => {
    // if (!socketInstance) {
    //     console.error('Socket not initialized. Call initializeSocket first.');
    //     return;
    // }

    // if (!messageData) {
    //     console.error('Message data is required');
    //     return;
    // }

    socketInstance.emit(eventName, message);
}