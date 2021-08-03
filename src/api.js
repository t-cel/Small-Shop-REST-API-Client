// esupplier@mail.com esupplier

if(!localStorage.getItem("userCredidentials"))
  localStorage.setItem("userCredidentials", JSON.stringify({ email: "", password: "" }));

const getAuthHeader = () => {
  const userCredidentials = JSON.parse(localStorage.getItem("userCredidentials"));
  return `Basic ${Buffer.from(`${userCredidentials.email}:${userCredidentials.password}`).toString('base64')}`;
}
  
const baseUrl = 'https://localhost:44302/shop_api';

const createHeaders = () => { return { 
  'Authorization': getAuthHeader(),
  'Access-Control-Allow-Origin': '*',
  'Accept': 'application/json'
}}

const fetchedCorrectly = (res) => res.status >= 200 && res.status < 300;

async function fetchDataFromAPI(url, init) {
  return await fetch(url, init).then((res) => {
    if(fetchedCorrectly(res)) {
      if(res.status != 204) { //no content
        return res.json();
      } else {
        return null;
      }
    } else {
      return new Error(`Error on fetching data from API, error code: ${res.status}`);  
    }
  })
  .catch((error) => console.error(error));
}

// CATEGORIES

export async function getCategories() {
  const url = `${baseUrl}/categories`;
  const init = { method: 'GET', headers: createHeaders()};
  return await fetchDataFromAPI(url, init);
}

// PRODUCTS

export async function getProducts(query) {
  const url = `${baseUrl}/products${query}`;
  const init = { method: 'GET', headers: createHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function getProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const init = { method: 'GET', headers: createHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function createProduct(product) {
  const url = `${baseUrl}/products/`;
  const postHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(product)};
  return await fetchDataFromAPI(url, init);
}

export async function updateProduct(id, product) {
  const url = `${baseUrl}/products/${id}`;
  const putHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
  const init = { method: 'PUT', headers: putHeaders, body: JSON.stringify(product)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const putHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
  }
  const init = { method: 'DELETE', headers: putHeaders};
  return await fetchDataFromAPI(url, init);
}

export async function getProductImages(productId) {
  const url = `${baseUrl}/products/${productId}/images`;
  const init = { method: 'GET', headers: createHeaders() };
  return await fetchDataFromAPI(url, init);
}

export async function addProductImage(productId, productImage) {
  const url = `${baseUrl}/products/${productId}/images`;
  const postHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(productImage) };
  return await fetchDataFromAPI(url, init);
}

// IMAGES

export async function uploadImage(image) {
  const url = `${baseUrl}/images/`;
  const postHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(image) };
  return await fetchDataFromAPI(url, init);
}

export async function getImage(imageURL) {
  const url = `${baseUrl}/images/${imageURL}`;
  const init = { method: 'GET', headers: createHeaders() };

  return await fetch(url, init).then((res) => {
    if(fetchedCorrectly(res)) {
      return res.blob();
    } else {
      throw new Error(`Error on fetching data from API, error code: ${res.status}`);  
    }
  })
  .catch((error) => console.error(error));
}

// USERS

export async function getUser() {
  const url = `${baseUrl}/user`;
  const init = { method: 'GET', headers: createHeaders() };
  return await fetchDataFromAPI(url, init);
}

export function setCredidentials(login, password) {
  const userCredidentials = {
    email: login, 
    password: password
  }

  localStorage.setItem("userCredidentials", JSON.stringify(userCredidentials));
}

// ORDERS

export async function getOrders(query) {
  const url = `${baseUrl}/orders${query}`;
  const init = { method: 'GET', headers: createHeaders() };
  return await fetchDataFromAPI(url, init); 
}

export async function updateOrder(id, order) {
  const url = `${baseUrl}/orders/${id}`;
  const putHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
  const init = { method: 'PUT', headers: putHeaders, body: JSON.stringify(order)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteOrder(id) {
  const url = `${baseUrl}/orders/${id}`;
  const putHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
  }
  const init = { method: 'DELETE', headers: putHeaders};
  return await fetchDataFromAPI(url, init);
}

export async function createOrder(order) {
  const url = `${baseUrl}/orders/`;
  const postHeaders = {
    'Authorization': getAuthHeader(),
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(order)};
  return await fetchDataFromAPI(url, init);
}