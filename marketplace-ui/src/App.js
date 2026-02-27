import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://tech-marketplace-production.up.railway.app/api";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  // Auth Functions
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, authData);
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthOpen(false);
      setAuthData({ email: '', password: '', username: '' });
    } catch (err) {
      alert(err.response?.data || "Authentication failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* NAVIGATION BAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 5%', backgroundColor: '#2c3e50', color: 'white',
        position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>🚀 MichaelTech</h1>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Hi, {user.username || 'User'}!</span>
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

      {/* SEARCH & PRODUCTS */}
      <div style={{ padding: '20px 5%' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input type="text" placeholder="Search gadgets..." style={{ width: '100%', maxWidth: '500px', padding: '12px', borderRadius: '25px', border: '1px solid #ddd' }} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
            <div key={product.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
              <h3 style={{ margin: '15px 0 5px' }}>{product.name}</h3>
              <p style={{ color: '#777', fontSize: '0.8rem', flexGrow: 1 }}>{product.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#27ae60' }}>${product.price}</span>
                <button onClick={() => addToCart(product)} style={{ padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add +</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOGIN / REGISTER MODAL */}
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

      {/* CART MODAL (Same as before) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '9