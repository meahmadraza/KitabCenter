const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const {
    getAllBooks,
    addUser,
    checkPassword,
    addInCart,
    getCartData,
    deleteFromCart
} = require('./public/operations');

const app = express();
const PORT = process.env.PORT || 3000;

let userLoggedIn = false;
let loginUser = {};

// Set EJS as view engine and views folder path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    try {
        const books = getAllBooks();
        res.render('home', { books, userLoggedIn, user: loginUser });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading homepage.");
    }
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    addUser(name, email, password);
    res.redirect('/signin');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const { value, user } = checkPassword(email, password);
    if (value) {
        userLoggedIn = true;
        loginUser = user;
        res.redirect('/');
    } else {
        userLoggedIn = false;
        res.redirect("/signin?message=Incorrect username or password");
    }
});

const categoryRoutes = ['allBooks', 'classic', 'fantasy', 'motivational', 'science', 'thriller', 'fiction'];
categoryRoutes.forEach(route => {
    app.get(`/${route}`, (req, res) => {
        const books = getAllBooks();
        res.render(`${route}Books`, { books, userLoggedIn, user: loginUser });
    });
});

app.get('/signin', (req, res) => res.render('signin-page'));
app.get('/signup', (req, res) => res.render('signup-page'));

app.get('/book-info', (req, res) => {
    const books = getAllBooks();
    const id = req.query.id - 1;
    res.render('book-info-page', { id, books, userLoggedIn, user: loginUser });
});

app.post('/addToCart', (req, res) => {
    setTimeout(() => {
        if (userLoggedIn) {
            const id = req.body.id;
            const username = loginUser.username;
            addInCart(id, username);
            res.redirect(`/book-info?id=${req.body.id}`);
        } else {
            res.redirect('/signin');
        }
    }, 2000);
});

app.get('/cart', (req, res) => {
    const books = getAllBooks();
    const cart = getCartData();
    res.render('cart', { books, userLoggedIn, user: loginUser, cart });
});

app.get('/delete-from-cart', (req, res) => {
    const id = req.query.id;
    deleteFromCart(id, loginUser.username);
    res.redirect('/cart');
});

app.get('/logout', (req, res) => {
    userLoggedIn = false;
    loginUser = {};
    res.redirect('/');
});

// Start server only locally (Vercel uses a different entry point)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`App listening at http://localhost:${PORT}`);
    });
}

module.exports = app; // Required for Vercel deployment
