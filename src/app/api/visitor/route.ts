import { Redis } from '@upstash/redis'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const redis = Redis.fromEnv()

export async function POST(request: Request) {
  try {
    const { guestName } = await request.json()

    if (!guestName || typeof guestName !== 'string') {
      return NextResponse.json(
        { error: 'guestName is required' },
        { status: 400 }
      )
    }

    const name = guestName.trim()

    if (!name) {
      return NextResponse.json({ error: 'guestName is empty' }, { status: 400 })
    }

    const cookieStore = await cookies()

    // =========================
    // LẤY DEVICE ID
    // =========================

    let visitorId = cookieStore.get('visitor_id')?.value

    let isNewDevice = false

    // Chưa có cookie → tạo device ID
    if (!visitorId) {
      visitorId = randomUUID()
      isNewDevice = true
    }

    const visitorKey = `visitor:${visitorId}`

    // =========================
    // LẤY DANH SÁCH TÊN
    // =========================

    const existingNames = (await redis.get<string[]>(visitorKey)) ?? []

    // Không lưu trùng tên
    if (!existingNames.includes(name)) {
      existingNames.push(name)
    }

    // Lưu lại
    await redis.set(visitorKey, existingNames)

    // =========================
    // LƯU COOKIE
    // =========================

    if (isNewDevice) {
      cookieStore.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      })
    }

    // =========================
    // ĐẾM DEVICE
    // =========================

    const visitorKeys = await redis.keys('visitor:*')

    return NextResponse.json({
      success: true,
      visitorId,
      names: existingNames,
      totalDevices: visitorKeys.length,
      isNewDevice
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
  try {
    const visitorKeys = await redis.keys('visitor:*')

    const visitors = []

    for (const key of visitorKeys) {
      const names = await redis.get<string[]>(key)

      visitors.push({
        visitorId: key.replace('visitor:', ''),
        names: names ?? []
      })
    }

    return NextResponse.json({
      totalDevices: visitorKeys.length,
      visitors
    })
  } catch (error) {
    console.error('Get visitors error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
