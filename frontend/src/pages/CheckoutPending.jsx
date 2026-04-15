import { Link } from 'react-router-dom';

export default function CheckoutPending() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>⏳ Pagamento pendente</h1>
      <p>Seu pagamento está sendo processado. Aguarde a confirmação.</p>
      <Link to="/orders">Ver meus pedidos</Link>
    </div>
  );
}