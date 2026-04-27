import { useState, useEffect } from 'react'
import { Layout } from './ui/Layout/Layout'
import { PlayGuide } from './features/guide'
import { BrowseAllCards } from './features/browse'
import { SingleDraw } from './features/play/SingleDraw'
import { cardDeck } from './data'

function getRoute(): string {
  return window.location.hash.replace('#', '') || '/'
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <Layout>
      {route === '/play' ? (
        <SingleDraw cards={cardDeck} />
      ) : route === '/guide' ? (
        <PlayGuide />
      ) : route === '/browse' ? (
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
