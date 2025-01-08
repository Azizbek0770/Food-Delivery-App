import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    restaurant: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { item, restaurantId } = action.payload;
      
      // Agar boshqa restorandan mahsulot qo'shilmoqchi bo'lsa, savatni tozalash
      if (state.restaurant && state.restaurant !== restaurantId) {
        state.items = [];
      }
      
      state.restaurant = restaurantId;
      
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find(i => i.id === itemId);
      
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(i => i.id !== itemId);
      } else {
        existingItem.quantity -= 1;
      }
      
      if (state.items.length === 0) {
        state.restaurant = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;