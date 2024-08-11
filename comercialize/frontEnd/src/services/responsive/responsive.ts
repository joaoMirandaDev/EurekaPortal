import { useEffect, useState } from 'react'

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    // Limpeza do evento ao desmontar o componente
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth
}
