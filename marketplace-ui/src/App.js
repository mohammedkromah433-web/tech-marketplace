import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://tech-marketplace-production.up.railway.app/api";
const ADMIN_EMAIL = "your-email@example.com"; // 👈 CHANGE THIS TO YOUR EMAIL

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth, Orders, & Admin States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get(`${API_BASE_URL}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/user/${user.id}`);
      setOrders(response.data);
      setShowOrders(true);
      setIsAdminMode(false);
    } catch (err) { alert("Could not load orders."); }
  };

  // ADMIN ACTIONS
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/products`, newProduct);
      alert("Product added successfully!");
      setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
      fetchProducts();
      setIsAdminMode(false);
    } catch (err) { alert("Failed to add product."); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) { alert("Delete failed."); }
    }
  };

  // CHECKOUT LOGIC
  const handleCheckout = async () => {
    if (!user) { alert("Please sign in to checkout!"); setIsAuthOpen(true); return; }
    const orderPayload = {
      userId: user.id,
      productNames: cart.map(item => item.name).join(", "),
      totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    };
    try {
      await axios.post(`${API_BASE_URL}/orders/checkout`, orderPayload);
      alert("Order placed! 🚀");
      setCart([]);
      setIsCartOpen(false);
      fetchOrders();
    } catch (err) { alert("Checkout failed."); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, authData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsAuthOpen(false);
    } catch (err) { alert("Auth failed"); }
  };

  const logout = () => { setUser(null); localStorage.removeItem('user'); setShowOrders(false); setIsAdminMode(false); };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* NAV BAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', backgroundColor: '#2c3e50', color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
        <h1 onClick={() => {setShowOrders(false); setIsAdminMode(false)}} style={{ cursor: 'pointer', margin: 0 }}>🚀 MichaelTech</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user && user.email === ADMIN_EMAIL && (
            <button onClick={() => {setIsAdminMode(!isAdminMode); setShowOrders(false)}} style={{ backgroundColor: '#f1c40f', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isAdminMode ? "Exit Admin" : "⚙️ Admin Panel"}
            </button>
          )}
          {user ? (
            <>
              <span onClick={fetchOrders} style={{ cursor: 'pointer', textDecoration: 'underline' }}>My Orders</span>
              <button onClick={logout} style={{ background: 'none', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => setIsAuthOpen(true)} style={{ background: '#3498db', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Sign In</button>
          )}
          <div onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>🛒 {cart.length}</div>
        </div>
      </nav>

      <div style={{ padding: '20px 5%' }}>

        {/* ADMIN PANEL VIEW */}
        {isAdminMode ? (
          <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '10px' }} />
              <input type="text" placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '10px' }} />
              <input type="number" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '10px' }} />
              <input type="text" placeholder="Image URL" required value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} style={{ padding: '10px' }} />
              <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Save to Database</button>
            </form>
          </div>
        ) : showOrders ? (
          /* ORDERS VIEW */
          <div>
            <button onClick={() => setShowOrders(false)}>← Back</button>
            <h2>Your Orders</h2>
            {orders.map(o => (
              <div key={o.id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
                <p><strong>Order #{o.id}</strong> - {o.productNames}</p>
                <p>Total: ${o.totalPrice}</p>
              </div>
            ))}
          </div>
        ) : (
          /* SHOP VIEW */
          <>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <input type="text" placeholder="Search..." style={{ width: '100%', maxWidth: '400px', padding: '10px', borderRadius: '20px' }} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                <div key={product.id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', position: 'relative' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button onClick={() => setCart([...cart, product])} style={{ width: '100%', padding: '8px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>Add to Cart</button>
                  {user && user.email === ADMIN_EMAIL && (
                    <button onClick={() => handleDeleteProduct(product.id)} style={{ marginTop: '10px', color: 'red', width: '100%', background: 'none', border: '1px solid red', borderRadius: '5px', cursor: 'pointer' }}>Delete Item</button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CART MODAL (Simplified) */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100%', backgroundColor: 'white', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)', padding: '20px', zIndex: 2000 }}>
          <button onClick={() => setIsCartOpen(false)}>Close</button>
          <h2>Your Cart</h2>
          {cart.map((item, i) => <div key={i}>{item.name} - ${item.price}</div>)}
          <hr />
          <h3>Total: ${cart.reduce((s, i) => s + i.price, 0).toFixed(2)}</h3>
          <button onClick={handleCheckout} style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none' }}>Checkout</button>
        </div>
      )}

      {/* AUTH MODAL (Simplified) */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px' }}>
            <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!isLoginMode && <input type="text" placeholder="Username" onChange={e => setAuthData({...authData, username: e.target.value})} />}
              <input type="email" placeholder="Email" onChange={e => setAuthData({...authData, email: e.target.value})} />
              <input type="password" placeholder="Password" onChange={e => setAuthData({...authData, password: e.target.value})} />
              <button type="submit">{isLoginMode ? "Login" : "Register"}</button>
            </form>
            <p onClick={() => setIsLoginMode(!isLoginMode)} style={{ cursor: 'pointer', color: 'blue' }}>Switch to {isLoginMode ? "Sign Up" : "Login"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;