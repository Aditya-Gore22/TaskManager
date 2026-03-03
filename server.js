const express = require('express');
const app = express();
const logger = require('./middleware/logMiddleware');

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

const cookieParser = require("cookie-parser");
app.use(cookieParser());


// Public Routes
const auth = require('./routes/authRoute');
app.use('/auth', auth);


//protected Routes
const authMiddleware = require('./middleware/authorizationMiddleware');
const router = express.Router();
router.use(authMiddleware.protectedRoute);
const taskRoutes = require('./routes/taskRoutes');
router.use('/', taskRoutes)
router.get('/dashboard', (req, res) => {
    res.send(`hello ${req.user.email}`);
});

app.use(router);

app.use((req, res) => {
  res.send('Route Not Found');
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});