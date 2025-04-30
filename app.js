const express = require('express');
const bodyParser = require('body-parser')
const session = require("express-session");
const { getAllBooks, addUser, checkPassword, addInCart, getCartData, deleteFromCart } = require('./public/operations');

const app = express();
const PORT = 3000;

let userLoggedIn = false;
let loginUser = {}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    const books = getAllBooks();
    res.render('home', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    addUser(name, email, password);

    res.redirect('/signin');
})

app.post('/signin', (req, res) => {
    if ("email" in req.body && "password" in req.body) {

        let email = req.body.email;
        let password = req.body.password;
        const { value, user } = checkPassword(email, password);
        // console.log(checkPassword(email, password));

        if (value) {
            userLoggedIn = true;
            loginUser = user;
            res.redirect('/');
        } else {
            userLoggedIn = false;
            res.redirect("/signin?message=Incorrect username or password");
        }
    } else {
        res.send("invalid request... username and password are required to login.")
    }
})

app.get('/allBooks', (req, res) => {
    const books = getAllBooks();
    res.render('allBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/classic', (req, res) => {
    const books = getAllBooks();
    res.render('classicBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/fantasy', (req, res) => {
    const books = getAllBooks();
    res.render('fantasyBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/motivational', (req, res) => {
    const books = getAllBooks();
    res.render('motivationalBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/science', (req, res) => {
    const books = getAllBooks();
    res.render('scienceBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/thriller', (req, res) => {
    const books = getAllBooks();
    res.render('thrillerBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/fiction', (req, res) => {
    const books = getAllBooks();
    res.render('fictionBooks', { books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.get('/signin', (req, res) => {
    res.render('signin-page')
})

app.get('/signup', (req, res) => {
    res.render('signup-page')
})

app.get('/book-info', (req, res) => {
    loginUser = loginUser;
    userLoggedIn = userLoggedIn;
    const books = getAllBooks();
    const id = req.query.id - 1;
    res.render('book-info-page', { id, books: books, userLoggedIn: userLoggedIn, user: loginUser })
})

app.post('/addToCart', (req, res) => {
    setTimeout(() => {
        if (userLoggedIn) {
            const id = req.body.id;
            const username = loginUser.username;
            addInCart(id, username);
            res.redirect(`/book-info?id=${req.body.id}`);
        } else {
            res.redirect('/signin')
        }

    }, 2000);

})


app.get('/cart', (req, res) => {
    const books = getAllBooks();
    const cart = getCartData();
    res.render('cart', { books: books, userLoggedIn: userLoggedIn, user: loginUser, cart: cart });
})

app.get('/delete-from-cart', (req, res) => {
    const id = req.query.id;
    deleteFromCart(id, loginUser.username);
    res.redirect('/cart');
})

app.get('/logout', (req, res) => {
    userLoggedIn = false;
    loginUser = {};
    res.redirect('/');
})


app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
})