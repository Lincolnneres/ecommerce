import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/orders', { items: cart, total });

      clearCart();

      // ✅ Redireciona pro checkout do MercadoPago
      window.location.href = data.checkoutUrl;

    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao finalizar pedido';
      alert(msg);
    }
  };

  if (cart.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty-icon">🛒</div>
      <h2>Seu carrinho está vazio</h2>
      <p>Adicione produtos para continuar comprando</p>
      <button onClick={() => navigate('/')}>Ver produtos</button>
    </div>
  );

  return (
    <div className="cart">
      <h2>Meu Carrinho</h2>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              {item.description && <p className="cart-item-desc">{item.description}</p>}
              <span className="cart-item-price">R$ {item.price.toFixed(2)} cada</span>
            </div>

            <div className="cart-item-actions">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                style={{
                  opacity: item.quantity >= item.stock ? 0.4 : 1,
                  cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer'
                }}
              >+</button>
            </div>

            {item.quantity >= item.stock && (
              <span style={{ color: '#e53e3e', fontSize: '0.75rem' }}>
                Limite de estoque atingido
              </span>
            )}

            <div className="cart-item-subtotal">
              R$ {(item.price * item.quantity).toFixed(2)}
            </div>

            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <button className="clear-btn" onClick={clearCart}>Limpar carrinho</button>
        <div className="cart-total">
          <span>Total: <strong>R$ {total.toFixed(2)}</strong></span>
          <button className="checkout-btn" onClick={handleCheckout}>
            Pagar com MercadoPago →
          </button>
        </div>
      </div>
    </div>
  );
}