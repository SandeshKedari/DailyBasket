import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface CartItem extends Product {
    quantity: number;
    savings: number;
}

interface CartState {
    products: Product[];
    items: CartItem[];
}

export const initialState: CartState = {
    products: [
        { id: '1', name: 'Bread', price: 1.10 },
        { id: '2', name: 'Milk', price: 0.50 },
        { id: '3', name: 'Cheese', price: 0.90 },
        { id: '4', name: 'Soup', price: 0.60 },
        { id: '5', name: 'Butter', price: 1.20 },
    ],
    items: []
};


const applyOffers = (items: CartItem[]) => {

    items.forEach(item => item.savings = 0);

    // first offre
    const cheese = items.find(i => i.name === "Cheese");
    if (cheese) {
        const freeCheese = Math.floor(cheese.quantity / 2);
        cheese.savings += freeCheese * cheese.price;
    }
    // second offer
    const soup = items.find(i => i.name === "Soup");
    const bread = items.find(i => i.name === "Bread");
    if (soup && bread) {
        const discountQty = Math.min(soup.quantity, bread.quantity);
        bread.savings += discountQty * (bread.price / 2);
    }

    // third offer  
    const butter = items.find(i => i.name === "Butter");
    if (butter) {
        butter.savings += butter.quantity * (butter.price * 0.34);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const existingItem = state.items.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const product = state.products.find(p => p.id === productId);
                if (product) {
                    state.items.push({ ...product, quantity: 1, savings: 0 });
                }
            }
            applyOffers(state.items); // apply offers after update
        },

        updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                }
            }
            applyOffers(state.items); // apply offers after update
        }
    }
});

export const { addItem, updateQuantity } = cartSlice.actions;

export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
