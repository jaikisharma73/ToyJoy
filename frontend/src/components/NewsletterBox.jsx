import React from 'react'
import { toast } from 'react-toastify';

const ContactUs = () => {
    const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "ab4d4b2a-dfef-449e-9c3f-35f3e8004057");

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if(data.success){
    toast.success('Thank You For Your Customization !')
    event.target.reset();
    }else{
    toast.error(data.message)
    }
        
    } catch (error) {
        toast.error(error.message)
    }
  };

  return (
    <div className=' text-center'>
      <p className='text-2xl font-medium text-gray-800'>Customize Your Perfect Toy</p>
      <p className='text-gray-400 mt-3'>
      Customize every detail to create a unique product experience designed just for you.
      </p>
      <form 
  onSubmit={onSubmit} 
  className="w-full sm:w-1/2 flex flex-col sm:flex-row items-stretch gap-3 mx-auto my-6 p-4  border-gray-300 rounded-lg"
>
  <textarea
    rows={6}
    name="message"
    placeholder="Enter here which type of toys you want"
    className="w-full p-3 text-sm outline-none border border-gray-400 rounded-md resize-none"
  />

  <button
    type="submit"
    className="bg-black text-white text-sm px-6 py-3 rounded-md sm:self-center"
  >
    Submit
  </button>
</form>
    </div>
  )
}

export default ContactUs
