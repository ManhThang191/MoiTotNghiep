import { useState, useEffect } from 'react'
import { PicMGArray } from '@/data/PicMGArray'

const BgPicScence = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PicMGArray.length)
    }, 5000) // 5 giây đổi ảnh

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {PicMGArray.map((pic, index) => (
        <img
          key={pic.url}
          src={pic.url}
          alt=""
          className={`
            absolute inset-0
            w-full h-full
            object-cover
            transition-opacity duration-1000
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'}
          `}
        />
      ))}

      {/* Lớp phủ để nội dung phía trên dễ đọc */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}

export default BgPicScence
