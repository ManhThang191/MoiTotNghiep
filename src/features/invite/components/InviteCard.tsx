'use client'

import { MapIcon, MapPin, Volume2, VolumeX, PhoneIcon } from 'lucide-react'
import { EVENT } from '../constants'
import CountdownTimer from './CountdownTimer'
import { useState, useRef, useEffect } from 'react'
import MapPopup from '@/components/MapPopup'
import BgPicScence from './BgPicScence'
import { PicMGArray } from '@/data/PicMGArray'
import VisitorCounter from '@/components/VisitorCounter'

interface InviteCardProps {
  guestName: string
}

export default function InviteCard({ guestName }: InviteCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMap, setShowMap] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)

  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false)

  useEffect(() => {
    if (!guestName) return

    const trackVisitor = async () => {
      try {
        await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guestName
          })
        })
      } catch (error) {
        console.error('Tracking visitor error:', error)
      }
    }

    trackVisitor()
  }, [guestName])

  useEffect(() => {
    const firstImage = new Image()
    firstImage.src = PicMGArray[0].url

    firstImage.onload = () => {
      setIsFirstImageLoaded(true)
      setLoadedImages((prev) => {
        const next = new Set(prev)
        next.add(PicMGArray[0].url)
        return next
      })
    }
  }, [])

  useEffect(() => {
    if (!isFirstImageLoaded) return

    const nextIndex = (currentIndex + 1) % PicMGArray.length
    const nextUrl = PicMGArray[nextIndex].url

    // Nếu ảnh kế tiếp chưa load thì preload
    if (!loadedImages.has(nextUrl)) {
      const img = new Image()

      img.src = nextUrl

      img.onload = () => {
        setLoadedImages((prev) => {
          const next = new Set(prev)
          next.add(nextUrl)
          return next
        })
      }

      return
    }

    // Ảnh kế tiếp đã sẵn sàng → chờ 4 giây rồi chuyển
    const timeout = setTimeout(() => {
      setCurrentIndex(nextIndex)
    }, 2500)

    return () => clearTimeout(timeout)
  }, [currentIndex, isFirstImageLoaded, loadedImages])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % PicMGArray.length)
  //   }, 4000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <div
      className="
      w-full
      max-w-sm
      lg:max-w-5xl
      mx-auto
      rounded-xl
      overflow-hidden
      shadow-md
      bg-[#FFF8F2]
      lg:flex
      lg:flex-row
      lg:mt-15
    "
    >
      <div>
        <button
          onClick={toggleMute}
          className="
          fixed
          cursor-pointer
          top-5
          right-5
          z-50
          w-11
          h-11
          rounded-full
          bg-[#FFF8F2]/90
          shadow-md
          flex
          items-center
          justify-center
          text-[#946728]
          hover:scale-110
          transition
        "
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      <audio
        ref={audioRef}
        src="/music/nhacnen.mp4"
        autoPlay
        loop
        preload="auto"
      />
      {/* ================= IMAGE ================= */}
      <div className="relative w-full lg:w-1/2 shrink-0 h-105 lg:h-131.25">
        {PicMGArray.map((pic, index) => {
          const isLoaded = loadedImages.has(pic.url)

          if (!isLoaded) return null

          return (
            <div
              key={pic.url}
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${pic.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 50%',

                opacity: index === currentIndex ? 1 : 0,

                transition: 'opacity 1.5s ease-in-out'
              }}
            />
          )
        })}

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* fade bottom */}
        <div
          className="
    absolute bottom-0 left-0 w-full h-14
    bg-linear-to-b from-transparent to-[#FFF8F2]

    lg:top-0 lg:right-0 lg:left-auto lg:bottom-auto
    lg:w-14 lg:h-full
    lg:bg-linear-to-r
  "
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="
        bg-[#FFF8F2]
        px-6
        py-6
        flex
        flex-col
        items-center
        gap-3
        w-full

        lg:w-1/2
        lg:justify-center
        lg:px-10
        lg:py-8
      "
      >
        {/* Host info */}
        <div className="text-center">
          <p className="font-vietnam text-xs text-[#B08060]">{EVENT.degree}</p>

          <p className="font-playfair font-bold text-xl text-[#3D2B1F] leading-snug">
            {EVENT.hostName}
          </p>
        </div>

        {/* Divider */}
        <div className="w-10 h-0.5 bg-[#FFB347]" />

        {/* Guest */}
        <div className="text-center">
          <p className="font-playfair italic text-sm text-[#7A5C45] mb-1">
            Xin trân trọng kính mời
          </p>

          <p className="font-playfair font-bold text-3xl text-[#3D2B1F] leading-tight border-b-2 border-[#FFB347] pb-1">
            Bạn <span className="text-[#af681d] font-bold">{guestName}</span>
          </p>

          <p className="font-vietnam text-sm text-[#7A5C45] mt-1">
            đến tham dự Lễ Tốt Nghiệp
          </p>
        </div>

        {/* Date */}
        <p className="font-vietnam font-semibold text-sm text-[#3D2B1F] text-center">
          {EVENT.displayDatetime}
        </p>

        {/* Countdown */}
        <div>
          <p className="font-vietnam text-xs text-[#B08060] text-center mb-2">
            Thời gian còn lại
          </p>

          <CountdownTimer />
        </div>

        {/* Location */}

        <a
          href={`tel:${EVENT.phoneNumber}`}
          className="
    font-vietnam
    cursor-pointer
    flex
    items-center
    justify-center
    gap-2
    px-4
    py-2
    rounded-full
    bg-[#FFF3E8]
    border
    border-[#E7C7A1]
    text-[#946728]
    hover:bg-[#FBE7D3]
    hover:scale-105
    transition-all
    duration-200
    shadow-sm
  "
        >
          <PhoneIcon size={20} color="#946728" className="phone-ring" />

          <span className="text-md">{EVENT.phoneNumber}</span>
        </a>

        {/* Map button */}
        {/* <button
          className="
          font-vietnam
          flex
          justify-center
          text-sm
          text-[#946728]
          hover:scale-105
          cursor-pointer
          transition-transform
        "
          onClick={() => setShowMap(!showMap)}
        >
          <MapIcon className="text-[#946728] mr-2" />
          Xem bản đồ trường
        </button> */}

        <MapPopup open={showMap} onClose={() => setShowMap(false)} />

        {/* Address */}
        <a
          href={EVENT.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
          flex
          items-start
          justify-center
          gap-2
          hover:opacity-75
          transition-opacity
        "
        >
          <MapPin size={20} className="mt-0.5 shrink-0 text-[#b37d31]" />

          <span className="font-vietnam text-md text-[#7A5C45] text-left">
            {EVENT.venue}
          </span>
        </a>

        <span
          style={{
            fontWeight: 200,
            fontSize: '0.875rem'
          }}
          className="text-center"
        >
          {EVENT.thanks}
        </span>

        <VisitorCounter guestName={guestName} />
      </div>
    </div>
  )
}
