'use client'

import Image from 'next/image'

interface MapPopupProps {
  open: boolean
  onClose: () => void
}

export default function MapPopup({ open, onClose }: MapPopupProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-4xl rounded-2xl bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl font-bold text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <Image
          src="/images/SoDoTruongHoc.jpg"
          alt="Bản đồ trường"
          width={1200}
          height={800}
          className="h-auto w-full rounded-xl"
        />
      </div>
    </div>
  )
}
