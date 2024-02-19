import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import React, { useState } from 'react';
import './App.scss'
import Nav from './components/Nav'
import Main from './components/Main';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Contact from './components/Contact';
import Payment from './components/Payment';

import Profile from './components/Profile';

import Item1 from './components/items/Item1';
import Item2 from './components/items/Item2'; // Component for item 2
import Item3 from './components/items/Item3';
import Item4 from './components/items/Item4';




function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setCartVisible] = useState(false);
  const [isPaymentVisible, setPaymentVisible] = useState(false);
  
  const toggleCart = () => {
    console.log('cart', cartItems)
    setCartVisible(!isCartVisible); //if false then true
  };

  const togglePayment = () => {
    setPaymentVisible(!isPaymentVisible); //if false then true
  };

  const addToCart = (product) => {
    const existingProduct = cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      // If the product exists, map over the cart items and increase the quantity of the existing product
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, product]);
    }
    setCartVisible(true); // Open cart when new item is added
  };
  
  return (
    <div className="App">
    <Router>
      <Nav onCartClick={toggleCart} onPaymentClick={togglePayment} />
      {isCartVisible && <Cart items={cartItems} onClose={() => setCartVisible(false)} onPaymentClick={togglePayment}/>}
      {isPaymentVisible && <Payment items={cartItems} onClose={() => setPaymentVisible(false)} />}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/item/1" element={<Item1 addToCart={addToCart}/>} />
        <Route path="/item/2" element={<Item2 addToCart={addToCart}/>} />
        <Route path="/item/3" element={<Item3 addToCart={addToCart}/>} />
        <Route path="/item/4" element={<Item4 addToCart={addToCart}/>} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </Router>
    </div>
  );
}

export default App;
