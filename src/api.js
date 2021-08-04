if(!localStorage.getItem("userCredidentials")) {
  localStorage.setItem("userCredidentials", JSON.stringify({ email: "", password: "" }));
}

const baseUrl = 'https://localhost:44302/shop_api';

// requests headers
const getAuthHeader = () => {
  const userCredidentials = JSON.parse(localStorage.getItem("userCredidentials"));
  return `Basic ${Buffer.from(`${userCredidentials.email}:${userCredidentials.password}`).toString('base64')}`;
}

const createBaseHeaders = () => ({
  'Authorization': getAuthHeader(),
  'Access-Control-Allow-Origin': '*',
});

const createGetHeaders = () => {
  const base = createBaseHeaders();
  base['Accept'] = 'application/json';
  return base;
};

const createPostHeaders = () => {
  const base = createBaseHeaders();
  base['Content-Type'] = 'application/json';
  base['Accept'] = 'application/json';
  return base;
};

const createPutHeaders = () => {
  const base = createBaseHeaders();
  base['Content-Type'] = 'application/json';
  return base;
}

const createDeleteHeaders = () => createBaseHeaders();

// general error returned when client cannot reach API
export const APIRespondError = "APIFailure";

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
      throw new Error(`Error on fetching data from API, error code: ${res.status}`);  
    }
  }).catch(e => APIRespondError);
}

// CATEGORIES

export async function getCategories() {
  const url = `${baseUrl}/categories`;
  const init = { method: 'GET', headers: createGetHeaders()};
  return await fetchDataFromAPI(url, init);
}

// PRODUCTS

export async function getProducts(query) {
  const url = `${baseUrl}/products${query}`;
  const init = { method: 'GET', headers: createGetHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function getProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const init = { method: 'GET', headers: createGetHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function createProduct(product) {
  const url = `${baseUrl}/products/`;
  const init = { method: 'POST', headers: createPostHeaders(), body: JSON.stringify(product)};
  return await fetchDataFromAPI(url, init);
}

export async function updateProduct(id, product) {
  const url = `${baseUrl}/products/${id}`;
  const init = { method: 'PUT', headers: createPutHeaders(), body: JSON.stringify(product)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const init = { method: 'DELETE', headers: createDeleteHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function getProductImages(productId) {
  const url = `${baseUrl}/products/${productId}/images`;
  const init = { method: 'GET', headers: createGetHeaders() };
  return await fetchDataFromAPI(url, init);
}

export async function addProductImage(productId, productImage) {
  const url = `${baseUrl}/products/${productId}/images`;
  const postHeaders = createPostHeaders();
  postHeaders['Accept'] = '*/*'; //API doesn't return any JSON when adding image to product
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(productImage) };
  return await fetchDataFromAPI(url, init);
}

// IMAGES

export async function uploadImage(image) {
  const url = `${baseUrl}/images/`;
  const init = { method: 'POST', headers: createPostHeaders(), body: JSON.stringify(image) };
  return await fetchDataFromAPI(url, init);
}

export async function getImage(imageURL) {
  const url = `${baseUrl}/images/${imageURL}`;
  const init = { method: 'GET', headers: createGetHeaders() };

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
  const init = { method: 'GET', headers: createGetHeaders() };
  return await fetchDataFromAPI(url, init);
}

export function setCredidentials(login, password) {
  localStorage.setItem("userCredidentials", JSON.stringify({email: login, password: password}));
}

export function logOff() {
  localStorage.setItem("userCredidentials", JSON.stringify({ email: "", password: ""}));
}

export function wasLoggedIn() {
  const userAuth = JSON.parse(localStorage.getItem("userCredidentials"));
  return userAuth.email != null && userAuth.password != null;
}

// ORDERS

export async function getOrders(query) {
  const url = `${baseUrl}/orders${query}`;
  const init = { method: 'GET', headers: createGetHeaders() };
  return await fetchDataFromAPI(url, init); 
}

export async function updateOrder(id, order) {
  const url = `${baseUrl}/orders/${id}`;
  const init = { method: 'PUT', headers: createPutHeaders(), body: JSON.stringify(order)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteOrder(id) {
  const url = `${baseUrl}/orders/${id}`;
  const init = { method: 'DELETE', headers: createDeleteHeaders()};
  return await fetchDataFromAPI(url, init);
}

export async function createOrder(order) {
  const url = `${baseUrl}/orders/`;
  const init = { method: 'POST', headers: createPostHeaders(), body: JSON.stringify(order)};
  return await fetchDataFromAPI(url, init);
}