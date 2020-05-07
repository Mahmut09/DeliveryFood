'use strict';

const cartButton = document.querySelector('#cart-button'),
      modal = document.querySelector('.modal'),
      close = document.querySelector('.close'),
      buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      sectionHeading = document.querySelector('.section-heading');

let login = localStorage.getItem('login');

const getData = async function(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)  
  }

  return await response.json();
  
};

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
}

function toggleModal() {
  modal.classList.toggle('is-open');
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  loginInput.style.background = '';
}

function returnMain() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('login');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }

  console.log('Авторизован');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);

}

function notAuthorized() {
  console.log('He aвторизован');

  function logIn(event) {
    event.preventDefault();
    loginInput.style.background = '';
    loginInput.style.borderColor = '';

    if (valid(loginInput.value.trim())) {

      login = loginInput.value;
      localStorage.setItem('login', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.background = '#ff00001f'; 
      loginInput.style.borderColor = '#ff00001f';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardsRestaurant({ image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery }) {

  const card = `
        <a class="card card-restaurant" data-products="${products}">
          <img src="${image}" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title">${name}</h3>
              <span class="card-tag tag">${timeOfDelivery}</span>
          </div>
          <div class="card-info">
            <div class="rating">
              ${stars}
            </div>
            <div class="price">От ${price} ₽</div>
            <div class="category">${kitchen}</div>
          </div>
        </div>
      </a>
    `

    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ description, image, name, price }) {  
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}</div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price}</strong>
        </div>
      </div>
  `) 
      
  cardsMenu.insertAdjacentElement('beforeend', card);
  
}

function restaurantTitle({ name, price, products, stars }) {
  const card = `
      <section class="menu hide">
      <div class="section-heading">
        <h2 class="section-title restaurant-title">${name}</h2>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">От ${price}</div>
          <div class="category">${products}</div>
        </div>
      </div>
    </section>
  `
}

function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest('.card-restaurant');
  
  if (restaurant) {

    if (login) {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood);
        data.forEach(restaurantTitle);
      });
    } else {
      toggleModalAuth();
    }
  }

}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardsRestaurant)
  });
  
  cartButton.addEventListener('click', toggleModal);
  
  close.addEventListener('click', toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', function() {
      containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
  })
  
  checkAuth();
  
  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
  })
}

init();
