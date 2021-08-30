const searchButton = document.getElementById('search-btn');
let orderdItems = [];

searchButton.addEventListener('click', () => {
    document.getElementById('error').innerHTML = '';
    document.getElementById('items').innerHTML = '';

    // get Input value
    const inputValue = document.getElementById('input').value;

    // validate input value
    if (inputValue.length > 0) {
        document.getElementById('spinner').classList.remove('d-none');
        getMealData(inputValue);
    } else {
        document.getElementById('error').innerHTML = `
            <p class="bg-danger text-white text-center p-4 w-50 mx-auto rounded-2">No Input! Please try again.</p>
        `
    }
    document.getElementById('input').value = '';
})

// API Call by meal name pass to function.
const getMealData = (mealName) => {

    // validate mealName is valid? And calling api
    if (mealName.length === 1) {
        foodCards(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealName}`);
    } else {
        foodCards(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    }
}

// fetch data from api and return data to foodCards function.
const fetchData = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// All searched food cards display function.
const foodCards = (url) => {
    fetchData(url).then(data => {
        // console.log(data);
        document.getElementById('spinner').classList.add('d-none');
        const itemsSection = document.getElementById('items');

        data.meals.forEach(item => {
            const { strMeal, strMealThumb } = item;
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
            <div class="card" style="width: 18rem; height: 24rem">
                <img height="200px" width="200px" src="${strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h6 class="card-title text-center">${strMeal}</h6>
                </div>
                <div class="card-footer text-center">
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal1" onclick="displayDetail('${strMeal}')" class="btn btn-primary">See Detail</button>
                </div>
          </div>
            `
            itemsSection.appendChild(div);
        })
    }).catch(err => {
        errorMessage();
    })
}

const displayDetail = (mealName) => {
    fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`).then(data => {
        console.log(data);
        const body = document.getElementById('body1');
        const header = document.getElementById('header1');
        const footer = document.getElementById('footer1');

        header.innerHTML = `
            <h5 class="modal-title" id="exampleModalLabel">${data.meals[0].strMeal}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        `
        body.innerHTML = `
            <div class="text-center">
                <img height="250px" width="250px" src="${data.meals[0].strMealThumb}" />
                <p>${data.meals[0].strInstructions.slice(0, 200)}</p>
            </div>
        `
        footer.innerHTML = `
            <button onclick="addToCart(${data.meals[0].idMeal})" type="button" class="btn btn-primary"><i class="fas fa-cart-plus"></i>&nbsp;Add to
            cart</button>
        `
    })
}

// Items added on cart function with meal Id.
const addToCart = (ItemId) => {
    const existingItem = orderdItems.find(item => item.idMeal == ItemId);

    if (existingItem !== undefined) {
        existingItem.quantity++;
        updateCart();
    } else {
        fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ItemId}`).then(data => {
            const { strMeal, strMealThumb, idMeal } = data.meals[0];
            orderdItems = [...orderdItems, { strMeal, strMealThumb, idMeal, quantity: 1 }];
            updateCart();
        })
    }
}

// Cart Function on modal.
const updateCart = () => {
    document.getElementById('count').innerText = orderdItems.length;

    const parentDiv = document.getElementById('carts');
    parentDiv.innerHTML = '';
    const footer = document.getElementById('footerr');

    orderdItems.map(item => {
        const div = document.createElement('div');
        div.classList.add('row');
        div.classList.add('my-3');
        div.innerHTML = `
            <div class="col">
                <div class="row">
                    <div class="col-lg-6 col-md-12 col-12">
                        <img height="150px" width="150px" src="${item.strMealThumb}" />
                    </div>
                    <div class="col-lg-6 col-md-12 col-12">
                        <h4>${item.strMeal}</h4>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                </div>
            </div>
        `
        parentDiv.appendChild(div);
    })
    footer.innerHTML = `
        <button onclick="clearCarts()" type="button" class="btn btn-success" data-bs-dismiss="modal"><i class="fas fa-check-circle"></i>&nbsp;Confirm
        to order</button>
    `
}

// confirm order to clear orderedCarts.
const clearCarts = () => {
    document.getElementById('count').innerText = 0;
    document.getElementById('carts').innerText = '';
    orderdItems = [];
    document.getElementById('items').innerHTML = '';
    document.getElementById('error').innerHTML = `
    <div class="bg-success p-4 text-white w-50 mx-auto text-center">
        <h2 class="text-center">Congratulations!</h2>
        <h4>Your Order has been Success</h4>
        <h1 class="text-danger">Thank You!</h1>
    </div>
    `
}

// errorMessage function.
const errorMessage = () => {
    document.getElementById('error').innerHTML = `
        <div class="bg-warning p-4 text-white w-50 mx-auto">
            <h2 class="text-center">Error!</h2>
            <p>Sorry! You have search food unavailable. Try Again.</p>
        </div>
    `
}