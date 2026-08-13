'use client'

import { useEffect, useState } from 'react'

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const getVisitorCount = async () => {
      try {
        const response = await fetch('/api/visitor', {
          method: 'GET',
          cache: 'no-store'
        })

        if (!response.ok) return

        const data = await response.json()

        setCount(data.count)
      } catch (error) {
        console.error('Visitor counter error:', error)
      }
    }

    getVisitorCount()
  }, [])

  if (count === null) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-1 text-sm text-[#7A5C45]">
      <span>👀</span>
      <span>{count} người ghé thăm</span>
    </div>
  )
}
