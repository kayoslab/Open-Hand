import { useEffect } from 'react'
import { Layout } from './ui/Layout/Layout'
import { HomePage } from './features/home'
import { PlayGuide } from './features/guide'
import { BrowseAllCards } from './features/browse'
import { SingleDraw } from './features/play/SingleDraw'
import { DrawThreeKeepOne } from './features/play/DrawThreeKeepOne'
import { ForTeams } from './features/teams'
import { Resources } from './features/resources'
import { About } from './features/about'
import { cardDeck } from './data'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { validateRoute } from './domain/preferences'

function getHashRoute(): string {
  return window.location.hash.replace('#', '') || ''
}

function App() {
  const [theme, toggleTheme] = useTheme()
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
    <Layout theme={theme} onToggleTheme={toggleTheme} isHomePage={route === '/'}>
      {route === '/play/draw-three' ? (
        <DrawThreeKeepOne cards={cardDeck} />
      ) : route === '/play' ? (
        <SingleDraw cards={cardDeck} />
      ) : route === '/guide' ? (
        <PlayGuide />
      ) : route === '/browse' ? (
        <BrowseAllCards />
      ) : route === '/for-teams' ? (
        <ForTeams />
      ) : route === '/resources' ? (
        <Resources />
      ) : route === '/about' ? (
        <About />
      ) : (
        <HomePage />
      )}
    </Layout>
  )
}

export default App
