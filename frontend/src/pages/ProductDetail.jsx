import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart(); // ✅ pega o cart também
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ quantos já estão no carrinho
  const cartItem = cart.find(item => item._id === product?._id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const isMaxStock = cartQty >= product?.stock;

  const handleAdd = (e) => {
    if (isMaxStock) return; // ✅ segurança extra
    addToCart(product);

    const btnRect = e.currentTarget.getBoundingClientRect();
    const cartEl = document.querySelector('.cart-link');
    const cartRect = cartEl
      ? cartEl.getBoundingClientRect()
      : { left: window.innerWidth - 100, top: 30 };

    const deltaX = cartRect.left - (btnRect.left + btnRect.width / 2);
    const deltaY = cartRect.top - (btnRect.top + btnRect.height / 2);

    const pid = Date.now();
    setParticles(prev => [...prev, {
      id: pid,
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top + btnRect.height / 2,
      image: product.image,
      deltaX,
      deltaY,
    }]);

    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== pid)), 900);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!product) return null;

  return (
    <div className="product-detail">
      {particles.map(p => (
        <div
          key={p.id}
          className="flying-item"
          style={{
            left: p.x,
            top: p.y,
            '--dx': `${p.deltaX}px`,
            '--dy': `${p.deltaY}px`,
          }}
        >
          <img src={p.image} alt="" />
        </div>
      ))}

      <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="product-detail-content">
        <div className="product-detail-image">
          <img
            src={product.image || 'https://placehold.co/400x400?text=Sem+Imagem'}
            alt={product.name}
            onError={e => e.target.src = 'https://placehold.co/400x400?text=Sem+Imagem'}
          />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">R$ {product.price.toFixed(2)}</p>
          {product.stock !== undefined && (
            <p className="product-detail-stock">
              {product.stock > 0 ? `${product.stock} em estoque` : '⚠️ Fora de estoque'}
            </p>
          )}

          {/* ✅ botão inteligente */}
          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={added || product.stock === 0 || isMaxStock}
          >
            {product.stock === 0
              ? '⚠️ Esgotado'
              : isMaxStock
                ? '🚫 Limite atingido'
                : added
                  ? '✓ Adicionado!'
                  : 'Adicionar ao carrinho'}
          </button>

          {/* ✅ aviso de quantos já no carrinho */}
          {cartQty > 0 && (
            <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '8px' }}>
              {cartQty} {cartQty === 1 ? 'unidade' : 'unidades'} já no carrinho
            </p>
          )}
        </div>
      </div>
    </div>
  );
}