import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "UserId is required" });
    }

    // Fetch user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData safely
    const cartData = user.cartData || {};

    if (!size) {
      return res.status(400).json({ success: false, message: "Select Product Size" });
    }

    // Add item to cart
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Save cart
    user.cartData = cartData;
    await user.save();

    res.json({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req,res) => {
    try {
        
        const { userId ,itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    // ✅ ADD THIS SAFETY CHECK
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = user.cartData || {};

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addToCart, updateCart, getUserCart }