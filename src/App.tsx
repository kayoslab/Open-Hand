import { Layout } from './ui/Layout/Layout'
import { BrowseAllCards } from './features/browse'

function App() {
  const page = window.location.pathname;

  return (
    <Layout>
      {page === '/browse' ? (
        <BrowseAllCards />
      ) : (
        <>
          <h2>Card Deck v2</h2>
          <p>Welcome to Open Hand</p>
        </>
      )}
    </Layout>
  )
}

export default App
