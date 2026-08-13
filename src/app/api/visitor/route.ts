import { Redis } from '@upstash/redis'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function POST(request: Request) {
  try {
    const { guestName } = await request.json()

    if (!guestName) {
      return NextResponse.json(
        { error: 'guestName is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()

    // Tạo key riêng cho khách
    const guestKey = `guest:${guestName}`

    const existingGuest = await redis.get<{
      guestName: string
      firstVisit: string
      lastVisit: string
      visitCount: number
    }>(guestKey)

    const now = new Date().toISOString()

    if (!existingGuest) {
      const guest = {
        guestName,
        firstVisit: now,
        lastVisit: now,
        visitCount: 1
      }

      await redis.set(guestKey, guest)

      cookieStore.set(`visited_${guestName}`, '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
      })

      return NextResponse.json({
        success: true,
        guest
      })
    }

    // Cập nhật lượt xem
    const updatedGuest = {
      ...existingGuest,
      lastVisit: now,
      visitCount: existingGuest.visitCount + 1
    }

    await redis.set(guestKey, updatedGuest)

    return NextResponse.json({
      success: true,
      guest: updatedGuest
    })
  } catch (error) {
    console.error('Visitor error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const cookieStore = await cookies()

  const visited = cookieStore.get('invite_visited')

  let count = await redis.get<number>('invite:visitors')

  // Người này chưa từng truy cập
  if (!visited) {
    count = await redis.incr('invite:visitors')

    cookieStore.set('invite_visited', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 ngày
    })
  }

  return NextResponse.json({
    count: count ?? 0
  })
}

export const dynamic = 'force-dynamic'
