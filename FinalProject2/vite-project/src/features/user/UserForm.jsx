import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { login, register } from "../features/user/userSlice";
import { login } from './userSlice';
import { register } from './userSlice';
import {
  FaUserCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaTimes,
} from "react-icons/fa";

const containerStyle = {
  backgroundColor: "#fff",
  color: "#333",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  width: "320px",
  margin: "100px auto",
  position: "relative",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  textAlign: "center",
  direction: "rtl",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  border: "1.5px solid #ccc",
  borderRadius: 6,
  padding: "6px 10px",
  marginBottom: 16,
  backgroundColor: "#f9f9f9",
};

const iconStyle = {
  marginLeft: 10,
  color: "#4a90e2",
};

const inputStyle = {
  border: "none",
  outline: "none",
  flex: 1,
  fontSize: 16,
  backgroundColor: "transparent",
  color: "#333",
};

const buttonStyle = {
  width: "100%",
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#4a90e2",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: 10,
};

const errorStyle = {
  color: "#e74c3c",
  fontSize: 13,
  marginTop: -12,
  marginBottom: 10,
  textAlign: "right",
};

const linkStyle = {
  background: "none",
  border: "none",
  color: "#4a90e2",
  cursor: "pointer",
  marginLeft: 10,
  fontWeight: "bold",
  fontSize: 14,
};

export default function UserForm({ product, onClose, onContinue }) {
  const dispatch = useDispatch();
  const { status, error, currentUser } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === "succeeded" && currentUser) {
      setShowSuccess(true);
    }
  }, [status, currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};
    if (!isLogin) {
      if (!form.username.trim()) errors.username = "שם משתמש דרוש";
      if (!form.email) errors.email = "אימייל דרוש";
      else if (!/\S+@\S+\.\S+/.test(form.email))
        errors.email = "פורמט אימייל לא חוקי";
      if (!form.phone) errors.phone = "טלפון דרוש";
      else if (!/^\d{10,14}$/.test(form.phone))
        errors.phone = "מספר טלפון לא חוקי";
      if (!form.password) errors.password = "סיסמה דרושה";
      else if (form.password.length < 6)
        errors.password = "הסיסמה חייבת לפחות 6 תווים";
    } else {
      if (!form.email) errors.email = "אימייל דרוש";
      if (!form.password) errors.password = "סיסמה דרושה";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin)
        dispatch(
          login({
            email: form.email,
            password: form.password,
          })
        );
      else
        dispatch(
          register({
            username: form.username,
            email: form.email,
            phone: form.phone,
            password: form.password,
          })
        );
    }
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          background: "transparent",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          color: "#888",
        }}
        aria-label="Close"
      >
        <FaTimes />
      </button>

      <h2>{isLogin ? "התחברות" : "הרשמה"}</h2>

      {showSuccess && (
        <div
          style={{
            backgroundColor: "#2ecc71",
            color: "#fff",
            padding: 10,
            borderRadius: 6,
            marginBottom: 14,
            fontWeight: "bold",
          }}
        >
          {isLogin ? "התחברת בהצלחה!" : "נרשמת בהצלחה!"}
        </div>
      )}

      {error && !showSuccess && (
        <div
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            padding: 10,
            borderRadius: 6,
            marginBottom: 14,
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} dir="rtl" noValidate>
        {!isLogin && (
          <>
            <div style={inputWrapperStyle}>
              <FaUser style={iconStyle} />
              <input
                type="text"
                name="username"
                placeholder="שם משתמש"
                value={form.username}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="username"
              />
            </div>
            {formErrors.username && (
              <div style={errorStyle}>{formErrors.username}</div>
            )}

            <div style={inputWrapperStyle}>
              <FaEnvelope style={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="אימייל"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            {formErrors.email && <div style={errorStyle}>{formErrors.email}</div>}

            <div style={inputWrapperStyle}>
              <FaPhone style={iconStyle} />
              <input
                type="tel"
                name="phone"
                placeholder="טלפון"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
                autoComplete="tel"
              />
            </div>
            {formErrors.phone && <div style={errorStyle}>{formErrors.phone}</div>}
          </>
        )}

        {isLogin && (
          <div style={inputWrapperStyle}>
            <FaEnvelope style={iconStyle} />
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              autoComplete="email"
            />
          </div>
        )}
        {formErrors.email && isLogin && (
          <div style={errorStyle}>{formErrors.email}</div>
        )}

        <div style={inputWrapperStyle}>
          <FaLock style={iconStyle} />
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>
        {formErrors.password && <div style={errorStyle}>{formErrors.password}</div>}

        <button type="submit" style={buttonStyle} disabled={status === "loading"}>
          {isLogin ? "התחבר" : "הרשם"}
        </button>
      </form>

      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          color: "#555",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {isLogin ? "אין לך חשבון?" : "יש לך חשבון?"}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormErrors({});
            setShowSuccess(false);
          }}
          style={linkStyle}
        >
          {isLogin ? "הרשם כאן" : "התחבר כאן"}
        </button>
      </div>
    </div>
  );
}
