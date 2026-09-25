import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CityPulse Render Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', background: '#0f172a', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: 700, width: '100%', background: '#1e293b', padding: 30, borderRadius: 20, border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
              <span style={{ fontSize: 28 }}>⚠️</span>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#f43f5e' }}>
                CityPulse Application Error Caught
              </h2>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 15px 0' }}>
              A component encountered an issue during execution. Please inspect the message below:
            </p>
            <pre style={{ background: '#090d16', padding: 15, borderRadius: 12, overflowX: 'auto', color: '#f87171', fontSize: 12, border: '1px solid #dc2626' }}>
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo?.componentStack && (
              <pre style={{ background: '#090d16', padding: 15, borderRadius: 12, overflowX: 'auto', color: '#94a3b8', fontSize: 11, marginTop: 10, maxHeight: 180 }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button 
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                style={{ padding: '10px 18px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
              >
                Clear Cache & Reload
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '10px 18px', background: '#334155', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
