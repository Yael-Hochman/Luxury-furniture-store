import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../features/cart/cartSlice";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems) ?? [];
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ code: id, qty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleOrder = () => {
    alert("תודה על ההזמנה! ניצור איתך קשר בקרוב.");
    dispatch(clearCart());
    setIsOpen(false);
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      {/* אייקון סל קניות קבוע בתחתית ימין בצבע שחור וזהב */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "black",
          color: "gold",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          zIndex: 1000,
          userSelect: "none",
          position: "fixed",
        }}
        title={`יש לך ${totalItems} מוצרים בעגלה`}
      >
        <FaShoppingCart />
        {totalItems > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              backgroundColor: "gold",
              borderRadius: "50%",
              width: 18,
              height: 18,
              fontSize: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "black",
              userSelect: "none",
            }}
          >
            {totalItems}
          </span>
        )}
      </div>

      {/* מודל עגלה */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* תוכן המודל - לעצור את הקליק מלהגיע לרקע */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "black",
              color: "gold",
              padding: 20,
              borderRadius: 12,
              width: 360,
              maxHeight: "80vh",
              overflowY: "auto",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              direction: "rtl",
              boxShadow: "0 0 20px gold",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: "center" }}>
              העגלה שלי ({totalItems} מוצרים)
            </h2>

            {cart.length === 0 && (
              <p style={{ textAlign: "center" }}>עגלה ריקה</p>
            )}

            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 15,
                  borderBottom: "1px solid gold",
                  paddingBottom: 10,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 50, height: 50, borderRadius: 8, marginLeft: 10 }}
                />
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontWeight: "bold" }}>{item.title}</div>
                  <div style={{ fontSize: 14 }}>
                    {item.price.toLocaleString()} ש"ח
                  </div>
                  <input
                    type="number"
                    value={item.qty}
                    min={1}
                    onChange={(e) => handleQuantityChange(item.id, +e.target.value)}
                    style={{
                      width: 50,
                      marginTop: 5,
                      borderRadius: 6,
                      border: "1.5px solid gold",
                      backgroundColor: "black",
                      color: "gold",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "gold",
                    cursor: "pointer",
                    fontSize: 18,
                    marginLeft: 8,
                  }}
                  title="הסר מהמוצר"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    textAlign: "right",
                    marginTop: 10,
                    borderTop: "1px solid gold",
                    paddingTop: 10,
                  }}
                >
                  סה"כ לתשלום: {totalPrice.toLocaleString()} ש"ח
                </div>

                <button
                  onClick={handleOrder}
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: "10px 0",
                    backgroundColor: "gold",
                    border: "none",
                    borderRadius: 8,
                    color: "black",
                    fontWeight: "bold",
                    fontSize: 16,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  הזמן עכשיו
                </button>
              </>
            )}

            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginTop: 15,
                backgroundColor: "transparent",
                border: "1.5px solid gold",
                borderRadius: 8,
                color: "gold",
                fontWeight: "bold",
                width: "100%",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  );
}
