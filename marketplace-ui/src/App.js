import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://tech-marketplace-production.up.railway.app/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error connecting to Railway:", error));
  }, []);

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (indexToRemove) => setCart(cart.filter((_, index) => index !== indexToRemove));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      {/* 1. RESPONSIVE NAVIGATION BAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 5%', backgroundColor: '#2c3e50', color: 'white',
        position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flexWrap: 'wrap' // Allows content to wrap on very small screens
      }}>
        <h1 style={{ margin: '0 10px 0 0', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>🚀 MichaelTechStore</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {/* Hide text links on very small screens to save space, or keep them compact */}
          <span style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'none', sm: 'block' }}>Products</span>
          <div
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative', cursor: 'pointer', fontSize: '1.5rem', marginLeft: '10px' }}
          >
            🛒 <span style={{
              backgroundColor: '#e74c3c', borderRadius: '50%', padding: '2px 6px',
              fontSize: '11px', position: 'absolute', top: '-8px', right: '-10px', color: 'white'
            }}>{cart.length}</span>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ padding: '20px 5%' }}>

        {/* RESPONSIVE SEARCH BAR */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Search for gadgets..."
            style={{
              width: '100%', maxWidth: '600px', padding: '12px 20px',
              borderRadius: '30px', border: '1px solid #ddd',
              fontSize: '1rem', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 3. SMART RESPONSIVE PRODUCT GRID */}
        <div style={{
          display: 'grid',
          // auto-fill + minmax handles the resizing automatically
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '25px',
          justifyContent: 'center'
        }}>
          {products
            .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(product => (
              <div key={product.id} style={{
                backgroundColor: 'white', padding: '15px', borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center',
                display: 'flex', flexDirection: 'column', transition: 'transform 0.2s'
              }}>
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '10px' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 style={{ margin: '15px 0 5px', fontSize: '1.1rem', color: '#333' }}>{product.name}</h3>
                <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '15px', flexGrow: 1 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#27ae60' }}>${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      padding: '8px 12px', backgroundColor: '#3498db', color: 'white',
                      border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                  >
                    Add +
                  </button>
                </div>
              </div>
            ))
          }