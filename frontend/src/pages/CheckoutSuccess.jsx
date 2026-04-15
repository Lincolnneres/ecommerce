import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>✅ Pagamento aprovado!</h1>
      <p>Seu pedido foi confirmado com sucesso.</p>
      <Link to="/orders">Ver meus pedidos</Link>
    </div>
  );
}