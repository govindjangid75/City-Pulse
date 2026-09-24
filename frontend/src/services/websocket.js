/**
 * Real-time WebSocket Service with auto-reconnection and event hooks.
 */

export function createPulseWebSocket(onMessage, onStatusChange) {
  let ws = null
  let isClosedExplicitly = false
  let reconnectTimer = null

  function connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws/zones`

    if (onStatusChange) onStatusChange('connecting')

    try {
      ws = new WebSocket(wsUrl)
    } catch (e) {
      if (onStatusChange) onStatusChange('disconnected')
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      if (onStatusChange) onStatusChange('connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (onMessage) onMessage(data)
      } catch (e) {
        console.error('Error parsing WS message', e)
      }
    }

    ws.onerror = () => {
      if (onStatusChange) onStatusChange('error')
    }

    ws.onclose = () => {
      if (onStatusChange) onStatusChange('disconnected')
      if (!isClosedExplicitly) {
        scheduleReconnect()
      }
    }
  }

  function scheduleReconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(() => {
      connect()
    }, 3000)
  }

  connect()

  return {
    close: () => {
      isClosedExplicitly = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (ws) ws.close()
    },
    send: (msg) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
    }
  }
}
