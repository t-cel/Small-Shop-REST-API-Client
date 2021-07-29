var username = 'esupplier@mail.com';
var password = 'esupplier'
var auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

const baseUrl = 'https://localhost:44302/shop_api';

const headers = { 
  'Authorization': auth,
  'Access-Control-Allow-Origin': '*',
  'Accept': 'application/json'
}

function fetchedCorrectly(res) {
  return res.status >= 200 && res.status < 300;
}

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
  })
  .catch((error) => console.error(error));
}

export async function getCategories() {
  const url = `${baseUrl}/categories`;
  const init = { method: 'GET', headers: headers};
  return await fetchDataFromAPI(url, init);
}

export async function getProducts(query) {
  const url = `${baseUrl}/products${query}`;
  const init = { method: 'GET', headers: headers};
  console.log(url);
  return await fetchDataFromAPI(url, init);
}

export async function getProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const init = { method: 'GET', headers: headers};
  return await fetchDataFromAPI(url, init);
}

export async function createProduct(product) {
  const url = `${baseUrl}/products/`;
  const postHeaders = {
    'Authorization': auth,
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
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
  const init = { method: 'PUT', headers: putHeaders, body: JSON.stringify(product)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteProduct(id) {
  const url = `${baseUrl}/products/${id}`;
  const putHeaders = {
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
  }
  const init = { method: 'DELETE', headers: putHeaders};
  return await fetchDataFromAPI(url, init);
}

export async function getProductImages(productId) {
  const url = `${baseUrl}/products/${productId}/images`;
  const init = { method: 'GET', headers: headers };
  return await fetchDataFromAPI(url, init);
}

export async function addProductImage(productId, productImage) {
  const url = `${baseUrl}/products/${productId}/images`;
  const postHeaders = {
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(productImage) };
  return await fetchDataFromAPI(url, init);
}

export async function uploadImage(image) {
  const url = `${baseUrl}/images/`;
  const postHeaders = {
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const init = { method: 'POST', headers: postHeaders, body: JSON.stringify(image) };
  return await fetchDataFromAPI(url, init);
}

export async function getImage(imageURL) {
  const url = `${baseUrl}/images/${imageURL}`;
  const init = { method: 'GET', headers: headers };

  return await fetch(url, init).then((res) => {
    if(fetchedCorrectly(res)) {
      return res.blob();
    } else {
      throw new Error(`Error on fetching data from API, error code: ${res.status}`);  
    }
  })
  .catch((error) => console.error(error));
}

export async function getUser() {
  const url = `${baseUrl}/user`;
  const init = { method: 'GET', headers: headers };
  return await fetchDataFromAPI(url, init);
}

export async function getOrders() {
  const url = `${baseUrl}/orders`;
  const init = { method: 'GET', headers: headers };
  return await fetchDataFromAPI(url, init); 
}

export async function updateOrder(id, order) {
  const url = `${baseUrl}/orders/${id}`;
  const putHeaders = {
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
  const init = { method: 'PUT', headers: putHeaders, body: JSON.stringify(order)};
  return await fetchDataFromAPI(url, init);
}

export async function deleteOrder(id) {
  const url = `${baseUrl}/orders/${id}`;
  const putHeaders = {
    'Authorization': auth,
    'Access-Control-Allow-Origin': '*',
  }
  const init = { method: 'DELETE', headers: putHeaders};
  return await fetchDataFromAPI(url, init);
}