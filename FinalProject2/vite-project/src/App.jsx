import React, { useState, useEffect } from "react";
import AllProduct from "./Components/AllProduct";
import Cart from "./Components/Cart";
import UserForm from "./features/user/UserForm";
import Navbar from "./Components/Navbar";
import MyOrders from "./Components/MyOrder"; // הנח שיש לך קומפוננטה כזו להצגת ההזמנות

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [formType, setFormType] = useState("login"); // login או register
  const [showOrders, setShowOrders] = useState(false);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowUserForm(true);
    setFormType("productDetails"); // אם תרצה להציג פרטי מוצר בטופס
  };

  const handleCloseForm = () => {
    setShowUserForm(false);
    setSelectedProduct(null);
  };

  const handleContinue = () => {
    setShowUserForm(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    function handleShowUserForm(e) {
      setFormType(e.detail); // "login" או "register"
      setShowUserForm(true);
      setSelectedProduct(null);
    }
    window.addEventListener("showUserForm", handleShowUserForm);
    return () => window.removeEventListener("showUserForm", handleShowUserForm);
  }, []);

  return (
    <div className="App" style={{ paddingTop: 60 }}>
      <Navbar onShowOrders={() => setShowOrders(true)} />

      <AllProduct onCardClick={handleCardClick} />
      <Cart />

      {showUserForm && (
        <UserForm
          formType={formType}
          product={selectedProduct}
          onClose={handleCloseForm}
          onContinue={handleContinue}
        />
      )}

      {showOrders && (
        <MyOrders onClose={() => setShowOrders(false)} />
      )}
    </div>
  );
}

export default App;
