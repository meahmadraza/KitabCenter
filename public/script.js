// document.querySelector("#add-to-cart-btn").addEventListener('click', () => {
//     alert("hey cart btn click");
// })

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    // Show the popup
    document.getElementById('cartPopup').classList.add('show');

    // Hide the popup after 3 seconds
    setTimeout(() => {
        cartPopup.classList.remove('show');
    }, 1000);
});

// function showNewArrivals() {
//     let newHTML = "";
//     for (let i = 3; i < 35; i += 7) {
//         newHTML += `<div id="book-box">
//                     <img src="${books[i].img_link}" alt="Book Cover">
//                     <a href="#">
//                         <h4>${books[i].book_name}</h4>
//                     </a>
//                     <h5>By: ${books[i].author_name}</h5>
//                     <h3>$${books[i].price}</h3>
//                   </div>`;
//     }
//     document.getElementById("books-slide-3").innerHTML = newHTML;
// }

// function showOnSale(books) {
//     let onSaleHTML = "";
//     for (let i = 20; i < 45; i += 6) {
//         onSaleHTML += `<div id="book-box">
//                        <img src="${books[i].img_link}" alt="Book Cover">
//                        <a href="#">
//                            <h4>${books[i].book_name}</h4>
//                        </a>
//                        <h5>By: ${books[i].author_name}</h5>
//                        <h3>$${books[i].price}</h3>
//                      </div>`;
//     }
//     document.getElementById("books-slide-3").innerHTML = onSaleHTML;
// }

// function showFeatured(books) {
//     let featuredHTML = "";
//     for (let i = 11; i < 35; i += 5) {
//         featuredHTML += `<div id="book-box">
//                          <img src="${books[i].img_link}" alt="Book Cover">
//                          <a href="#">
//                              <h4>${books[i].book_name}</h4>
//                          </a>
//                          <h5>By: ${books[i].author_name}</h5>
//                          <h3>$${books[i].price}</h3>
//                        </div>`;
//     }
//     document.getElementById("books-slide-3").innerHTML = featuredHTML;
// }

// Fetch books data from server API endpoint


