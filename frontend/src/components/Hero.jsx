import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  const images = [
  assets.hero_img,
  assets.hero_img2,
  assets.hero_img3
]

const [currentIndex, setCurrentIndex] = useState(0)

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }, 3000)

  return () => clearInterval(interval)
}, [])
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141]'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    <p className=' font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                </div>
            </div>
      </div>
      {/* Hero Right Side */}
      <div className='w-full sm:w-1/2 relative h-[260px] sm:h-[400px] md:h-[500px] overflow-hidden'>
  {images.map((img, index) => (
    <img
      key={index}
      src={img}
      alt="hero"
      className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000
      ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
    />
  ))}
</div>
    </div>
  )
}

export default Hero
