/**
 * Real-time WebSocket Service for CityPulse live updates
 */

export function createPulseWebSocket(onMessage, onError) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/ws/zones`
  
  const ws = new WebSocket(wsUrl)

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (e) {
      console.error('Error parsing WS message', e)
    }
  }

  ws.onerror = (error) => {
    if (onError) onError(error)
  }

  return ws
}
