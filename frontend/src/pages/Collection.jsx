import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import HeroChatbot from '../components/HeroChatbot'

const Collection = () => {

  const { products , search , showSearch , aiFilter } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev,e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = [...filterProducts];

    if (sortType === 'low-high') {
      fpCopy.sort((a,b)=> a.price - b.price)
    }
    else if (sortType === 'high-low') {
      fpCopy.sort((a,b)=> b.price - a.price)
    }

    setFilterProducts(fpCopy)
  }

  useEffect(()=>{ applyFilter() },
    [category,subCategory,search,showSearch,products])

  useEffect(()=>{ sortProduct() },[sortType])

  // AI filter from chatbot
  useEffect(() => {
    if (!aiFilter) return;

    const map = {
      educational: "Educational Toys",
      education: "Educational Toys",
      building: "Building & Construction Toys",
      indoor: "Indoor & Outdoor Play Toys",
      outdoor: "Indoor & Outdoor Play Toys"
    };

    if (map[aiFilter]) setSubCategory([map[aiFilter]]);
  }, [aiFilter]);

  return (
    <div>
      <HeroChatbot/>
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
        
        <div className='min-w-60'>
          <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
            FILTERS
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
          </p>

          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value='Boys'
                  checked={category.includes("Boys")} onChange={toggleCategory}/> Boys
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value='Girls'
                  checked={category.includes("Girls")} onChange={toggleCategory}/> Girls
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value='Kids'
                  checked={category.includes("Kids")} onChange={toggleCategory}/> Kids
              </p>
            </div>
          </div>
          {/* SubCategory Filter */}
<div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
  <p className='mb-3 text-sm font-medium'>TYPE</p>
  <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

    <p className='flex gap-2'>
      <input
        className='w-3'
        type="checkbox"
        value='Educational Toys'
        checked={subCategory.includes("Educational Toys")}
        onChange={toggleSubCategory}
      /> Educational Toys
    </p>

    <p className='flex gap-2'>
      <input
        className='w-3'
        type="checkbox"
        value='Building & Construction Toys'
        checked={subCategory.includes("Building & Construction Toys")}
        onChange={toggleSubCategory}
      /> Building & Construction Toys
    </p>

    <p className='flex gap-2'>
      <input
        className='w-3'
        type="checkbox"
        value='Indoor & Outdoor Play Toys'
        checked={subCategory.includes("Indoor & Outdoor Play Toys")}
        onChange={toggleSubCategory}
      /> Indoor & Outdoor Play Toys
    </p>

  </div>
</div>
        </div>
        

        <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            <select onChange={(e)=>setSortType(e.target.value)}
              className='border-2 border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name}
                id={item._id} price={item.price} image={item.image} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Collection