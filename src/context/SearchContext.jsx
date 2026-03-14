import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [open, setOpen]           = useState(false)
  const [loading, setLoading]     = useState(false)
  const navigate = useNavigate()

  // Called by Navbar when user types
  const search = useCallback((q) => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
  }, [])

  // Pages register their data so search can surface results
  const [registry, setRegistry] = useState([])

  const registerData = useCallback((items) => {
    setRegistry(items)
  }, [])

  const getResults = useCallback((q) => {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    return registry.filter(item =>
      item.label.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower)
    ).slice(0, 8)
  }, [registry])

  const goTo = useCallback((path) => {
    setOpen(false)
    setQuery('')
    navigate(path)
  }, [navigate])

  return (
    <SearchContext.Provider value={{ query, search, results: getResults(query), open, setOpen, loading, registerData, goTo }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
