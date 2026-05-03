import { createContext, useReducer, useContext, useState } from 'react';

const Context = createContext();

const getSafeUserInfo = () => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch {
        localStorage.removeItem('userInfo');
        return null;
    }
};

const getSafeCart = () => {
    try {
        const cartItems = localStorage.getItem('cartItems');
        return cartItems ? JSON.parse(cartItems) : [];
    } catch { return []; }
};

const initialState = {
    userInfo: getSafeUserInfo(),
    cartItems: getSafeCart(),
    wishlist: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            localStorage.setItem('userInfo', JSON.stringify(action.payload)); // ← FIX: also persist here
            return { ...state, userInfo: action.payload };

        case 'USER_LOGOUT':
            localStorage.removeItem('userInfo');
            localStorage.removeItem('cartItems');
            return { ...state, userInfo: null, cartItems: [] };

        case 'ADD_TO_CART': {
            const newItem = action.payload;
            const existItem = state.cartItems.find(i => i._id === newItem._id);
            const cartItems = existItem
                ? state.cartItems.map(i => i._id === existItem._id ? newItem : i)
                : [...state.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cartItems };
        }

        case 'REMOVE_FROM_CART': {
            const cartItems = state.cartItems.filter(i => i._id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cartItems };
        }

        case 'UPDATE_CART_QTY': {
            const cartItems = state.cartItems.map(i =>
                i._id === action.payload._id ? { ...i, qty: action.payload.qty } : i
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cartItems };
        }

        case 'CLEAR_CART': {
            localStorage.removeItem('cartItems');
            return { ...state, cartItems: [] };
        }

        default:
            return state;
    }
};

export const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [authModal, setAuthModal] = useState(false);
    const [authTab, setAuthTab]     = useState('login');

    const openLogin    = () => { setAuthTab('login');    setAuthModal(true); };
    const openRegister = () => { setAuthTab('register'); setAuthModal(true); };
    const closeAuthModal = () => setAuthModal(false);

    return (
        <Context.Provider value={{
            /* ── state shortcuts (so components don't need state.userInfo) ── */
            userInfo:  state.userInfo,
            cartItems: state.cartItems,
            /* ── full state + dispatch for anything else ── */
            state,
            dispatch,
            /* ── auth modal ── */
            authModal,
            authTab,
            setAuthTab,
            openLogin,
            openRegister,
            closeAuthModal,
        }}>
            {children}
        </Context.Provider>
    );
};

export const useGlobalContext = () => useContext(Context);