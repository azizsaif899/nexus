import dynamic from 'next/dynamic'

const App = dynamic(() => import('../App'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111b21',
      color: '#e9edef'
    }}>
      Loading...
    </div>
  )
})

export default function HomePage() {
  return <App />
}