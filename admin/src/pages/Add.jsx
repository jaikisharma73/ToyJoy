import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'

const Add = ({ token }) => {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Boys");
  const [subCategory, setSubCategory] = useState("Educational Toys");
  const [bestseller, setBestseller] = useState(false);

  const [sizes, setSizes] = useState([
    { size: "S", price: "" },
    { size: "M", price: "" },
    { size: "L", price: "" },
    { size: "XL", price: "" },
    { size: "XXL", price: "" }
  ]);

  // ✅ Load product when editing
  // ✅ Load product when editing
const fetchProductData = async () => {
  try {
    const res = await axios.post(backendUrl + "/api/product/single", { id });

    // 🛡️ SAFETY CHECK ADDED
    if (res.data.success && res.data.product) {
      const p = res.data.product;

      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price || "");
      setCategory(p.category || "Boys");
      setSubCategory(p.subCategory || "Educational Toys");
      setBestseller(p.bestseller || false);
      setSizes(p.sizes?.length ? p.sizes : [
        { size: "S", price: "" },
        { size: "M", price: "" },
        { size: "L", price: "" },
        { size: "XL", price: "" },
        { size: "XXL", price: "" }
      ]);

      // 🛡️ Optional chaining prevents crash
      setImage1(p.image?.[0] || false);
      setImage2(p.image?.[1] || false);
      setImage3(p.image?.[2] || false);
      setImage4(p.image?.[3] || false);

    } else {
      toast.error("Product not found");
      navigate('/list');
    }

  } catch (err) {
    console.log(err);
    toast.error("Failed to load product");
  }
};

  useEffect(() => {
  if (isEdit && id) fetchProductData();
}, [id, isEdit]);

  // ✅ Submit Handler (Add / Update)
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      if (isEdit) formData.append("id", id)

      image1 && typeof image1 !== "string" && formData.append("image1", image1)
      image2 && typeof image2 !== "string" && formData.append("image2", image2)
      image3 && typeof image3 !== "string" && formData.append("image3", image3)
      image4 && typeof image4 !== "string" && formData.append("image4", image4)

      const url = isEdit
        ? backendUrl + "/api/product/update"
        : backendUrl + "/api/product/add";

      const response = await axios.post(url, formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // ✅ Image preview helper
  const preview = (img) => {
    if (!img) return assets.upload_area
    if (typeof img === "string") return img
    return URL.createObjectURL(img)
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i+1}`}>
              <img className='w-20 h-20 object-cover border' src={preview(img)} alt="" />
              <input onChange={(e)=> {
                const setter = [setImage1,setImage2,setImage3,setImage4][i]
                setter(e.target.files[0])
              }} type="file" id={`image${i+1}`} hidden/>
            </label>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name}
          className='w-full max-w-[500px] px-3 py-2 border' type="text" required/>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description}
          className='w-full max-w-[500px] px-3 py-2 border' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

        <div>
          <p className='mb-2'>Product category</p>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className='px-3 py-2 border'>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className='px-3 py-2 border'>
            <option value="Educational Toys">Educational Toys</option>
            <option value="Building & Construction Toys">Building & Construction Toys</option>
            <option value="Indoor & Outdoor Play Toys">Indoor & Outdoor Play Toys</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Base Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price}
            className='px-3 py-2 border w-[120px]' type="number" />
        </div>

      </div>

      <div>
        <p className='mb-2'>Product Sizes & Prices</p>
        <div className='flex flex-col gap-3'>
          {sizes.map((item, index) => (
            <div key={index} className='flex items-center gap-4'>
              <span className='w-12 font-medium'>{item.size}</span>
              <input type="number" value={item.price}
                onChange={(e)=>{
                  const updated = [...sizes];
                  updated[index].price = e.target.value;
                  setSizes(updated);
                }}
                className='border px-3 py-1 w-32' />
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={()=>setBestseller(prev=>!prev)} checked={bestseller} type="checkbox" id='bestseller'/>
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type="submit" className='w-32 py-3 mt-4 bg-black text-white'>
        {isEdit ? "UPDATE PRODUCT" : "ADD PRODUCT"}
      </button>

    </form>
  )
}

export default Add