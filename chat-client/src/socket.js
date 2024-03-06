import { io } from 'socket.io-client';
const URL = 'http://localhost:4000/chat'

class SocketSingleton {
  constructor() {
    this.authToken = null;
    this.socket = null;
  }

  connect(token) {
    this.authToken = token;
    this.socket = io(URL, {
      extraHeaders: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
  }

  updateToken(newToken) {
    // Disconnect the existing socket
    if (this.socket) {
      this.socket.disconnect();
    }

    // Update the token
    this.authToken = newToken;

    // Reconnect with the new token
    this.connect(this.authToken);
  }
}

export const socketSingleton = new SocketSingleton();
