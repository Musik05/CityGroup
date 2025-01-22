"use strict"
//==========================================

document.querySelector('.burger').addEventListener('click', function(){
    this.classList.toggle('active');
    document.querySelector('.menu').classList.toggle('open');
})

import { ERROR_SERVER, PRODUCT_INFORMATION_NOT_FOUND } from './constants.js';
import { 
    showErrorMessage,
    checkingRelevanceValueBasket
} from './utils.js';

const wrapper = document.querySelector('.wrapper');
let productsData = [];


getProducts();


async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('./products6.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
        
        loadProductDetails(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err.message);
    }
}


function getParameterFromURL(parameter) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameter);
}


function loadProductDetails(data) {

    if (!data || !data.length) {
        showErrorMessage(ERROR_SERVER)
        return;
    }

    checkingRelevanceValueBasket(data);

    const productId = Number(getParameterFromURL('id'));

    if (!productId) {
        showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND)
        return;
    }

    const findProduct = data.find(card => card.id === productId);

    if(!findProduct) {
        showErrorMessage(PRODUCT_INFORMATION_NOT_FOUND)
        return;
    }
    renderInfoProduct(findProduct);
}

function renderInfoProduct(product) {
    const { img, title, price, adress, Статус, Количество, Площадь, Кухня, Жилая, Этаж } = product;
    const priceforone = price/Площадь; 
    const productItem = 
        `
            <div class="product">
                <div class="product__img">
                    <img src="./images/${img}" alt="${title}">
                </div>
                <div class="product__inner-price">
                    <div class="product__price">
                        ${price}₽ <span>${priceforone.toFixed(0)}₽ за кв/м</span>
                    </div>
                </div>
                <h2 class="product__title">${title} </h2>
                <div class="buttons">
                    <a href="tel:+79882285517"><button style="cursor: pointer;">Позвонить</button></a>
                    <a href="https://wa.me/+79883054545"><button style="cursor: pointer;">Написать</button></a>
                </div>
                <h2>О квартире</h2>
                <p class="product__info"> <span>Статус:</span> ${Статус}</p>
                <p class="product__info"> <span>Количество комнат:</span> ${Количество}</p>
                <p class="product__info"> <span>Общая площадь:</span> ${Площадь}кв/м</p>
                <p class="product__info"> <span>Площадь кухни:</span> ${Кухня}</p>
                <p class="product__info"><span>Жилая площадь:</span> ${Жилая}</p>
                <p class="product__info"><span>Этаж:</span> ${Этаж}</p>
                <h2>Расположение</h2>
                <p class="product__info">${adress}</p>
                <h2>Описание</h2>
            </div>
        `
    wrapper.insertAdjacentHTML('beforeend', productItem);
}