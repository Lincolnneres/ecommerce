import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    };
    fetchOrders();
  }, []);

  if (orders.length === 0) return (
    <div className="orders-empty">
      <h2>Você ainda não fez nenhum pedido</h2>
    </div>
  );

  return (
    <div className="orders">
      <h2>Meus Pedidos</h2>
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <span>Pedido #{order._id.slice(-6).toUpperCase()}</span>
            <span className={`status ${order.status}`}>{order.status}</span>
          </div>
          <div className="order-items">
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total: R$ {order.total.toFixed(2)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}