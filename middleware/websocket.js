import { WebSocketServer } from 'ws'

export default function () {
  const server = new WebSocketServer({ noServer: true })

  server.on('connection', (socket) => {
    console.log('Pelanggan connected')

    socket.on('message', (message) => {
      console.log('Received:', message)
    })

    socket.on('close', () => {
      console.log('Pelanggan disconnected')
    })

    setInterval(() => {
      const newMessage = { id: Date.now(), text: 'New message from server' }
      server.pelanggans.forEach(pelanggan => {
        if (pelanggan.readyState === WebSocket.OPEN) {
          pelanggan.send(JSON.stringify(newMessage))
        }
      })
    }, 5000) // Send a new message every 5 seconds
  })

  return (req, res, next) => {
    if (req.url === '/ws' && req.headers.upgrade === 'websocket') {
      server.handleUpgrade(req, req.socket, Buffer.alloc(0), (socket) => {
        server.emit('connection', socket, req)
      })
    } else {
      next()
    }
  }
}
