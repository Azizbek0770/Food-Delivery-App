class WebSocketService {
    constructor(type, messageHandler) {
      this.type = type; // 'delivery' yoki 'customer'
      this.messageHandler = messageHandler;
      this.ws = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
    }
  
    connect() {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const wsUrl = `${process.env.REACT_APP_WS_URL}/${this.type}/?token=${token}`;
      this.ws = new WebSocket(wsUrl);
  
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandler(data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => this.connect(), 5000);
      }
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
      }
    }
  
    send(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }
  
  export default WebSocketService;