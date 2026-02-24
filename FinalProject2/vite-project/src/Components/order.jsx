import React from "react";
import { useSelector } from "react-redux";

export default function Orders({ onClose }) {
  const orders = useSelector((state) => state.orders.orders || []);
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return <p>אנא התחבר/י כדי לראות את ההזמנות שלך.</p>;
  }

  const userOrders = orders.filter(
    (order) => order.userId === currentUser.id
  );

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        direction: "rtl",
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          left: 15,
          top: 15,
          background: "transparent",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: "#999",
        }}
        aria-label="Close Orders"
      >
        &times;
      </button>

      <h2 style={{ marginBottom: 20, textAlign: "center" }}>ההזמנות שלי</h2>

      {userOrders.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>
          אין הזמנות להצגה
        </p>
      )}

      {userOrders.map((order) => (
        <div
          key={order.id}
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: 15,
            marginBottom: 15,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 5 }}>
            מספר הזמנה: {order.id}
          </div>
          <div>
            תאריך: {new Date(order.orderDate || order.date).toLocaleDateString("he-IL")}
          </div>
          <div style={{ marginTop: 10 }}>
            {(order.items || order.cart || []).map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div>{item.title || item.name}</div>
                <div>
                  {(item.quantity || item.qty)} × {item.price.toLocaleString()} ש"ח
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              fontWeight: "bold",
              textAlign: "right",
              fontSize: 15,
            }}
          >
            סה"כ לתשלום:{" "}
            {(order.items || order.cart || []).reduce(
              (acc, i) => acc + i.price * (i.quantity || i.qty),
              0
            ).toLocaleString()}{" "}
            ש"ח
          </div>
        </div>
      ))}
    </div>
  );
}
