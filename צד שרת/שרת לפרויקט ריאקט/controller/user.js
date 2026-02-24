const fs = require('fs');
const path = './users.json';

exports.register = (req, res) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ");

    let users = JSON.parse(data).users || [];
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password)
      return res.status(400).send("יש למלא את כל השדות");

    const exists = users.find(u => u.username === username || u.email === email);
    if (exists) return res.status(400).send("שם משתמש או אימייל כבר קיימים");

    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      username,
      email,
      phone,
      password,
      isAdmin: false
    };

    users.push(newUser);
    fs.writeFile(path, JSON.stringify({ users }, null, 2), err => {
      if (err) return res.status(500).send("שגיאה בשמירת המשתמש");
      res.send(newUser);
    });
  });
};

exports.login = (req, res) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ");

    const users = JSON.parse(data).users;
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).send("אימייל או סיסמה שגויים");
    }

    res.send(user);
  });
};

exports.logout = (req, res) => {
  res.send({ message: "התנתקת בהצלחה" });
};

exports.get = (req, res) => {
  const userId = req.headers.userid;
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ");

    const users = JSON.parse(data).users;
    const currentUser = users.find(u => u.id == userId);
    if (!currentUser || !currentUser.isAdmin)
      return res.status(403).send("אין הרשאה");

    res.send(users);
  });
};

exports.getById = (req, res) => {
  const userId = req.params.id;
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) return res.status(500).send("שגיאה בקריאת קובץ");

    const users = JSON.parse(data).users;
    const user = users.find(u => u.id == userId);
    if (!user) return res.status(404).send("משתמש לא נמצא");

    res.send(user);
  });
};
