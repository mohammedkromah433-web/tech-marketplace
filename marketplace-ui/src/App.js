import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]); // Added cart state
  const removeFromCart = (indexToRemove) => {
    // We use index instead of ID so we only remove ONE instance if they have 2 of the same item
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch data from your Java Backend
  useEffect(() => {
    axios.get('http://10.246.8.40:8080/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error:", error));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };
// This calculates the total price of everything in the cart
const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* 1. NAVIGATION BAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 5%', backgroundColor: '#2c3e50', color: 'white',
        position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🚀 TechStore</h1>
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer' }}>Home</span>
          <span style={{ cursor: 'pointer' }}>Products</span>
          {/* Update your cart icon div to this: */}
          <div
            onClick={() => setIsCartOpen(true)} // This opens the cart
            style={{ position: 'relative', cursor: 'pointer', fontSize: '1.5rem' }}
          >
            🛒 <span style={{
              backgroundColor: '#e74c3c', borderRadius: '50%', padding: '2px 7px',
              fontSize: '12px', position: 'absolute', top: '-10px', right: '-10px', color: 'white'
            }}>{cart.length}</span>
          </div>

        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ padding: '30px 5%' }}>

        {/* SEARCH BAR (Placed above the grid) */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Search for gadgets (e.g. Laptop, Mouse)..."
            style={{
              width: '100%', maxWidth: '600px', padding: '15px',
              borderRadius: '30px', border: '1px solid #ddd',
              fontSize: '1rem', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 3. PRODUCT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {products
            .filter(product =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(product => (
              <div key={product.id} style={{
                backgroundColor: 'white', padding: '20px', borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <h3 style={{ margin: '15px 0 5px', color: '#333' }}>{product.name}</h3>
                <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#27ae60' }}>${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      padding: '8px 15px', backgroundColor: '#3498db', color: 'white',
                      border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))
          }
        </div>

        {/* MENTION IF NO PRODUCTS FOUND */}
        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>No products found matching "{searchTerm}"</p>
        )}
      </div>
      {/* CART MODAL OVERLAY */}
      {isCartOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '15px',
            width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >✕</button>

            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Shopping Cart</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty!</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{item.name}</span>
                      <br />
                      <small style={{ color: '#888' }}>${item.price.toFixed(2)}</small>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        backgroundColor: '#ff7675', color: 'white', border: 'none',
                        borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <h3>Total: ${cartTotal.toFixed(2)}</h3>
                  <button style={{
                    width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white',
                    border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer'
                  }}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;