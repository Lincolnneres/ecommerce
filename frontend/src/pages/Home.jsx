import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);
  const [particles, setParticles] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get('/products', { params: { category, search } });
      setProducts(data);
    };
    fetchProducts();
  }, [category, search]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;

    addToCart(product);

    const btnRect = e.currentTarget.getBoundingClientRect();
    const cartEl = document.querySelector('.cart-link');
    const cartRect = cartEl
      ? cartEl.getBoundingClientRect()
      : { left: window.innerWidth - 100, top: 30 };

    const deltaX = cartRect.left - (btnRect.left + btnRect.width / 2);
    const deltaY = cartRect.top - (btnRect.top + btnRect.height / 2);

    const id = Date.now();
    setParticles(prev => [...prev, {
      id,
      x: btnRect.left + btnRect.width / 2,
      y: btnRect.top + btnRect.height / 2,
      image: product.image,
      deltaX,
      deltaY,
    }]);

    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="home">
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

      <form autoComplete="off" onSubmit={e => e.preventDefault()} style={{ display: 'contents' }}>
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="eletronicos">Eletrônicos</option>
            <option value="roupas">Roupas</option>
            <option value="livros">Livros</option>
            <option value="outros">Outros</option>
          </select>
        </div>
      </form>

      <div className="products-grid">
        {products.map(product => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="product-card-image">
              <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} />
              {product.stock === 0 && (
                <span className="badge-esgotado">Esgotado</span>
              )}
            </div>

            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            {product.description && <p className="description">{product.description}</p>}
            <p className="price">R$ {product.price.toFixed(2)}</p>

            <button
              className={`add-btn ${addedId === product._id ? 'added' : ''} ${product.stock === 0 ? 'esgotado' : ''}`}
              onClick={(e) => handleAddToCart(product, e)}
              disabled={addedId === product._id || product.stock === 0}
            >
              {product.stock === 0
                ? '🚫 Esgotado'
                : addedId === product._id
                ? '✓ Adicionado!'
                : 'Adicionar ao carrinho'}
            </button>
          </div>
        ))}
        {products.length === 0 && <p>Nenhum produto encontrado.</p>}
      </div>
    </div>
  );
}