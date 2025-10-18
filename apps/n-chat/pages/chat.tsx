import dynamic from 'next/dynamic'

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b141a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      direction: 'rtl'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          💬
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#00a884',
          marginBottom: '20px'
        }}>
          جاري تحميل المحادثة...
        </h1>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #1f2937',
          borderTop: '4px solid #00a884',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
})

export default function ChatPage() {
  return <App />
}