import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    restaurantId: null,
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const { restaurantId, item } = action.payload;
      
      // Agar boshqa restorandan mahsulot qo'shilmoqchi bo'lsa, savatni tozalash
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }
      
      state.restaurantId = restaurantId;
      
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      state.total = state.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    },
    removeItem: (state, action) => {
      const { itemId } = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      state.total = state.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
      
      state.total = state.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;