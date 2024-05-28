import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {WebSocketServer} from "ws";

installGlobals();


const customWs = () => {
  return {
    name: 'custom-ws',
    configureServer(server) {
      const wss = new WebSocketServer({server: server.httpServer})

      wss.on('connection', (ws) => {
        console.log('WebSocket connection established')
        ws.send(JSON.stringify({ status: 'connected' }))

        // 주기적으로 ping 메시지 보내기
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 2000) // 30초마다 ping 메시지 전송

        ws.on('message', (message) => {
          const parsedMessage = JSON.parse(message)
          if (parsedMessage.type === 'pong') {
            console.log('Received pong from client')
          }
        })

        ws.on('close', () => {
          clearInterval(interval)
          console.log('WebSocket connection closed')
        })
      })
    },
  }
}

export default defineConfig({
  server: {
    port:3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678,  // 원하는 포트 번호 설정
      clientPort: 24678,
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [remix(), tsconfigPaths(),customWs()],
});
