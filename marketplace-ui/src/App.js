import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Ensure this matches your Railway backend URL
const API_BASE_URL = "https://tech-marketplace-production.up.railway.app/api";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth & Orders States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // 1. Fetch Orders for the logged-in user
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/user/${user.id}`);
      setOrders(response.data);
      setShowOrders(true); // Switch view to show order list
    } catch (err) {
      console.error("Error fetching orders", err);
      alert("Could not load orders history.");
    }
  };

  // 2. Handle Checkout Logic
  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to checkout!");
      setIsAuthOpen(true);
      return;
    }
    if (cart.length === 0) return alert("Cart is empty!");

    const orderPayload = {
      userId: user.id,
      productNames: cart.map(item => item.name).join(", "),
      totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    };

    try {
      await axios.post(`${API_BASE_URL}/orders/checkout`, orderPayload);
      alert("Order placed successfully! 🚀");
      setCart([]); // Clear cart after success
      setIsCartOpen(false);
      fetchOrders(); // Redirect to orders view
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Make sure your orders table exists in Railway!");
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, authData);
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthOpen(false);
    } catch (err) {
      alert(err.response?.data || "Authentication failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowOrders(false);
  };

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVIGATION BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', backgroundColor: '#2c3e50', color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
        <h1 onClick={() => setShowOrders(false)} style={{ cursor: 'pointer', margin: 0 }}>🚀 MichaelTech</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span onClick={fetchOrders} style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>My Orders</span>
              <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} style={{ background: '#3498db', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</button>
          )}
          <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', fontSize: '1.5rem' }}>
            🛒 <span style={{ backgroundColor: '#e74c3c', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', position: 'absolute', top: '-8px', right: '-10px', color: 'white' }}>{cart.length}</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px 5%' }}>
        {showOrders ? (
          /* ORDER HISTORY VIEW */
          <div>
            <button onClick={() => setShowOrders(false)} style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}>← Back to Shop</button>
            <h2>My Order History</h2>
            {orders.length === 0 ? <p>No orders yet!</p> : orders.map(order => (
              <div key={order.id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <p><strong>Order ID:</strong> #{order.id}</p>
                <p><strong>Items:</strong> {order.productNames}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Date: {new Date(order.orderDate).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          /* PRODUCT LIST VIEW */
          <>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <input type="text" placeholder="Search gadgets..." style={{ width: '100%', maxWidth: '500px', padding: '12px', borderRadius: '25px', border: '1px solid #ddd' }} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                <div key={product.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  <h3 style={{ margin: '15px 0 5px' }}>{product.name}</h3>
                  <p style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '15px' }}>${product.price}</p>
                  <button onClick={() => addToCart(product)} style={{ marginTop: 'auto', width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add to Cart</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CART MODAL WITH CHECKOUT */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', position: 'relative' }}>
            <button onClick={() => setIsCartOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h2>Your Cart</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {cart.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.name}</span>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span>${item.price}</span>
                    <button onClick={() => removeFromCart(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 ? (
              <>
                <h3 style={{ textAlign: 'right', marginTop: '15px' }}>Total: ${cartTotal.toFixed(2)}</h3>
                <button onClick={handleCheckout} style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Checkout Now</button>
              </>
            ) : (
              <p style={{ textAlign: 'center', color: '#777' }}>Your cart is empty!</p>
            )}
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '15px', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setIsAuthOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isLoginMode ? 'Login' : 'Create Account'}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {!isLoginMode && (
                <input type="text" placeholder="Username" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} value={authData.username} onChange={(e) => setAuthData({...authData, username: e.target.value})} />
              )}
              <input type="email" placeholder="Email" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} />
              <input type="password" placeholder="Password" required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} />
              <button type="submit" style={{ padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>{isLoginMode ? 'Login' : 'Register'}</button>
            </form>
            <p onClick={() => setIsLoginMode(!isLoginMode)} style={{ textAlign: 'center', marginTop: '15px', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem' }}>
              {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;