const express = require('express');
const serverless = require('serverless-http'); // required for Vercel
const bodyParser = require('body-parser');
const session = require("express-session");
const {
    getAllBooks,
    addUser,
    checkPassword,
    addInCart,
    getCartData,
    deleteFromCart
} = require('../public/operations'); // Adjust path since this will live in /api now

const app = express();

let userLoggedIn = false;
let loginUser = {};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    const books = getAllBooks();
    res.render('home', { books, userLoggedIn, user: loginUser });
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    addUser(name, email, password);
    res.redirect('/signin');
});

app.post('/signin', (req, res) => {
    if ("email" in req.body && "password" in req.body) {
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
    } else {
        res.send("invalid request... username and password are required to login.");
    }
});

app.get('/allBooks', (req, res) => {
    const books = getAllBooks();
    res.render('allBooks', { books, userLoggedIn, user: loginUser });
});

// Other category routes...
['classic', 'fantasy', 'motivational', 'science', 'thriller', 'fiction'].forEach((genre) => {
    app.get(`/${genre}`, (req, res) => {
        const books = getAllBooks();
        res.render(`${genre}Books`, { books, userLoggedIn, user: loginUser });
    });
});

app.get('/signin', (req, res) => {
    res.render('signin-page');
});

app.get('/signup', (req, res) => {
    res.render('signup-page');
});

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

// No app.listen here! Instead:
module.exports = app;
module.exports.handler = serverless(app); // Required for Vercel
