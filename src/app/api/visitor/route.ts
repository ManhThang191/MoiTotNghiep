import { Redis } from '@upstash/redis'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

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
