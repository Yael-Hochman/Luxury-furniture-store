import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../features/order/orderSlice';
import { FaClipboardList } from 'react-icons/fa';

export default function MyOrders({ onClose }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const { orders, status, error } = useSelector(state => state.orders);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchOrders(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const userOrders = orders.filter(order => order.userId === currentUser?.id);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, height: '100vh', width: '350px',
      backgroundColor: '#1a1a1a', color: '#ffd700', padding: '20px',
      zIndex: 1001, overflowY: 'auto', boxShadow: '-2px 0 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2><FaClipboardList style={{ marginRight: '8px' }} />ההזמנות שלי</h2>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: '#ffd700', fontSize: 22, cursor: 'pointer' }}
          aria-label="Close orders panel"
        >
          ❌
        </button>
      </div>

      {status === 'loading' && <p>טוען...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
      {userOrders.length === 0 && status === 'succeeded' && <p>אין הזמנות להצגה</p>}

      {userOrders.map((order, idx) => (
        <div key={order.id || idx} style={{ background: '#2a2a2a', marginBottom: '15px', padding: '10px', borderRadius: '8px' }}>
          <div><strong>תאריך:</strong> {new Date(order.date).toLocaleString()}</div>
          <div><strong>סה"כ:</strong> ₪{order.totalAmount}</div>
          <ul style={{ marginTop: '5px', paddingRight: '20px' }}>
            {order.items.map((item, i) => (
              <li key={i}>{item.name} - ₪{item.price} x {item.qty}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
