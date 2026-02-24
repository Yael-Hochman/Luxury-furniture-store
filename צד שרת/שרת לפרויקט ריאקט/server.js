const express = require('express');
const cors = require('cors');
const fs = require('fs');

const product = require('./router/product'); 
const user = require('./router/user'); 

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// לוגים
app.use((req, res, next) => {
  const logText = new Date().toGMTString() + "  : " + req.method + " " + req.url + '\n';
  fs.appendFile("log.txt", logText, () => next());
});

app.get('/', (req, res) => {
  res.send("hello world");
});

// --- נתיבי הזמנות ---

// 1. קבלת הזמנות של משתמש ספציפי (GET)
app.get('/order', (req, res) => {
  const userId = Number(req.query.userId);

  fs.readFile("orders.json", "utf-8", (err, data) => {
      if (err) {
          return res.status(500).send("שגיאה בקריאת הקובץ");
      }
      try {
          const allOrders = JSON.parse(data);
          const userOrders = allOrders.filter(o => o.userId === userId);
          res.json(userOrders);
      } catch (parseErr) {
          res.status(500).send("שגיאה בעיבוד הנתונים");
      }
  });
});

// 2. יצירת הזמנה חדשה ושמירה לקובץ (POST) - זה מה שהיה חסר!
app.post('/order', (req, res) => {
    fs.readFile("orders.json", "utf-8", (err, data) => {
        if (err) return res.status(500).send("שגיאה בקריאת הקובץ");

        let orders = [];
        try {
            orders = JSON.parse(data);
        } catch (e) { orders = []; }

        const newOrder = req.body; 
        // יצירת ID חדש: לוקחים את ה-ID האחרון ומוסיפים 1
        newOrder.id = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;
        newOrder.date = new Date().toISOString();

        orders.push(newOrder);

        fs.writeFile("orders.json", JSON.stringify(orders, null, 2), (err) => {
            if (err) return res.status(500).send("שגיאה בשמירת ההזמנה");
            res.status(201).send(newOrder); 
        });
    });
});

// --- חיבור הראוטרים האחרים ---
app.use("/product", product);
app.use("/user", user);

// טיפול בנתיבים לא קיימים
app.use((req, res) => {
  res.status(404).send("404 - הנתיב לא נמצא");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});