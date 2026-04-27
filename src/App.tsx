import { useState, useEffect } from 'react'
import { Layout } from './ui/Layout/Layout'
import { PlayGuide } from './features/guide'
import { BrowseAllCards } from './features/browse'

function getPath() {
  return window.location.pathname
}

function App() {
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onPopState = () => setPath(getPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (
        anchor &&
        anchor.href &&
        anchor.origin === window.location.origin &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !anchor.hasAttribute('download') &&
        anchor.target !== '_blank'
      ) {
        e.preventDefault()
        const next = new URL(anchor.href).pathname
        if (next !== window.location.pathname) {
          window.history.pushState(null, '', next)
          setPath(next)
        }
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <Layout>
      {path === '/guide' ? (
        <PlayGuide />
      ) : path === '/browse' ? (
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
