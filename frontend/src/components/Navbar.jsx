
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-full">🛒 Comércio eletrônico</span>
        <span className="brand-short">🛒 CE</span>
      </Link>
      <div className="navbar-right">
        <Link to="/cart" className="cart-link">Carrinho ({cartCount})</Link>
        {user ? (
          <>
            <Link to="/orders">Pedidos</Link>
            {user.isAdmin && <Link to="/admin">Administrador</Link>}
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}