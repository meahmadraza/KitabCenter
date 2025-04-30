const fs = require('fs');
const { Module } = require('module');

function getAllBooks() {
    const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'books.json'))).books;
    return books;
}


function addUser(name, username, password) {
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
    if (usersData.users.find(user => user.username === username)) {
        console.log("User already exists");
    } else {
        const newUser = { name, username, password };
        usersData.users.push(newUser);
        fs.writeFileSync('users.json', JSON.stringify(usersData));
    }
}

function checkPassword(username, password) {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'))).users;

    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        return { value: true, user };
    } else {
        return { value: false };
    }
}

function addInCart(bookId, username) {

    const cartData = JSON.parse(fs.readFileSync(path.join(__dirname, 'Cart.json')));

    if (cartData[username]) {
        cartData[username].push({ bookId });
        console.log(username);
    } else {
        cartData[username] = [{ bookId }];
    }
    fs.writeFileSync('Cart.json', JSON.stringify(cartData));

}

function getCartData() {
    const cart = JSON.parse(fs.readFileSync(path.join(__dirname, 'cart.json')));
    return cart;
}

function deleteFromCart(bookId, username) {
    const cartData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cart.json')));

    if (cartData[username]) {

        cartData[username] = cartData[username].filter(item => item.bookId !== bookId);

        fs.writeFileSync('cart.json', JSON.stringify(cartData));
        console.log(`Book with ID ${bookId} deleted from ${username}'s cart.`);
    } else {
        console.log(`User ${username} does not have any books in the cart.`);
    }
    return;
}

module.exports = { getAllBooks, addUser, checkPassword, addInCart, getCartData, deleteFromCart };