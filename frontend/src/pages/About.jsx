import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>ToyJoy — where fun meets imagination! ToyJoy is a modern toy shopping platform created to bring happiness to children and convenience to parents. We offer a wide range of safe, high-quality, and engaging toys that inspire creativity, learning, and joyful playtime.</p>
          <p>From educational games and action figures to adorable plush toys and exciting playsets, ToyJoy carefully selects every product to ensure smiles for every age. Our mission is to make toy shopping easy, affordable, and delightful, turning every purchase into a moment of joy for families.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At ToyJoy, our mission is to bring joy to every child by providing safe, high-quality, and engaging toys that inspire creativity, learning, and imagination. We aim to make toy shopping simple and enjoyable for parents while creating magical play experiences that help children grow, explore, and smile every day.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We ensure every toy meets strict safety, durability, and quality standards for children.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience: </b>
          <p className='text-gray-600'>Enjoy easy browsing, secure payments, fast delivery, and a smooth, hassle-free toy shopping experience.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Friendly support team providing quick assistance, easy returns, and a smooth, satisfying customer experience..</p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About
