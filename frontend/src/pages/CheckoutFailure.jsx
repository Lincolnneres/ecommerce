import { Link } from 'react-router-dom';

export default function CheckoutFailure() {
  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>❌ Pagamento recusado</h1>
      <p>Houve um problema com seu pagamento. Tente novamente.</p>
      <Link to="/cart">Voltar ao carrinho</Link>
    </div>
  );
}