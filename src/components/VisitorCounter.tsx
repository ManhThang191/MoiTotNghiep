'use client'

import { useEffect, useState } from 'react'

export default function VisitorCounter({ guestName }: { guestName: string }) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const getVisitors = async () => {
      try {
        const response = await fetch('/api/visitor')

        if (!response.ok) {
          throw new Error('Failed to get visitors')
        }

        const data = await response.json()

        setTotal(data.totalDevices)
      } catch (error) {
        console.error('Get visitor error:', error)
      }
    }

    getVisitors()
  }, [])

  if (total === null) {
    return null
  }

  return guestName === 'MaiGiang111' || guestName === '1234' ? (
    <div className="flex items-center justify-center gap-1 text-sm text-[#7A5C45]">
      <span>👀</span>
      <span>{total} người ghé thăm</span>
    </div>
  ) : (
    <></>
  )
}
