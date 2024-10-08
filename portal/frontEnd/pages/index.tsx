import { NavigateToResource } from '@refinedev/nextjs-router'
import React from 'react'

export default function Home() {
  return (
    <React.StrictMode>
      <NavigateToResource resource="/empresas" />
    </React.StrictMode>
  )
}

Home.noLayout = true
