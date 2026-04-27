import { useEffect } from 'react'
import { Layout } from './ui/Layout/Layout'
import { PlayGuide } from './features/guide'
import { BrowseAllCards } from './features/browse'
import { SingleDraw } from './features/play/SingleDraw'
import { DrawThreeKeepOne } from './features/play/DrawThreeKeepOne'
import { cardDeck } from './data'
import { useLocalStorage } from './hooks/useLocalStorage'
import { validateRoute } from './domain/preferences'

function getHashRoute(): string {
  return window.location.hash.replace('#', '') || ''
}

function App() {
  const [route, setRoute] = useLocalStorage('openhand:lastRoute', '/', validateRoute)

  useEffect(() => {
    const hash = getHashRoute()
    if (hash) {
      setRoute(validateRoute(hash) ? hash : '/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onHashChange() {
      const hash = getHashRoute()
      if (hash) {
        setRoute(validateRoute(hash) ? hash : '/')
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [setRoute])

  return (
    <Layout>
      {route === '/play/draw-three' ? (
        <DrawThreeKeepOne cards={cardDeck} />
      ) : route === '/play' ? (
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
