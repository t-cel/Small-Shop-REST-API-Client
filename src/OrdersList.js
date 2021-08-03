import React, { useEffect, useState } from 'react';

import { 
    getCategories,
    getOrders,
    getProduct, 
    updateOrder,
    deleteOrder
} from './api';

import { Link, withRouter } from 'react-router-dom';

import OperationButtons from './OperationButtons';
import EventBus from 'eventing-bus';

const OrderListItem = (props) => {
  const handleChange = ({target}) => {
    props.handleChange(target, props.order.id);
  }

  const order = props.order;
  const product = order.product;
  const orderStatuses = [ "Ordered", "Sent", "Delivered" ];
  
  return (
    <tr className="order_list_item">
      <td>{order.id}</td>
      <td><Link to={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">{product.name}</Link></td>
      <td>{props.categories[product.categoryId-1].name}</td>
      <td>{order.count}</td>
      <td>{order.buyerId}</td>
      <td>
        <div className="dropdown" id="category_dropdown">
          <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {orderStatuses[order.orderStatus]}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button className="dropdown-item" onClick={handleChange} id="orderStatus" value="0">{orderStatuses[0]}</button>
            <button className="dropdown-item" onClick={handleChange} id="orderStatus" value="1">{orderStatuses[1]}</button>
            <button className="dropdown-item" onClick={handleChange} id="orderStatus" value="2">{orderStatuses[2]}</button>
          </div>
        </div>
      </td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={() => props.onItemRemove(order.id)}>Remove</button>
      </td>
    </tr>  
  );
}

const OrdersList = (props) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [anyItemModified, setAnyItemModified] = useState(false);

  let filterBusEvent = undefined;

  const confirmChanges = async () => {
    const _items = [...items];

    for(let i in _items) {
      if(_items[i].modified) {
        console.log("modified item: ", i);
        const updatedItem = {
          id: _items[i].id,
          buyerId: _items[i].buyerId,
          count: _items[i].count,
          orderStatus: parseInt(_items[i].orderStatus),
          productId: _items[i].productId
        };
        _items[i].modified = false;
        await updateOrder(updatedItem.id, updatedItem);
      }
    }

    setItems(_items);
    setAnyItemModified(false);
  }

  useEffect(() => {
    filterBusEvent = EventBus.on("applyFilterToOrdersList", async (query) => await loadItems(query));

    (async () => await loadItems(""))();

    return function cleanup() {
      filterBusEvent(); //unregister global event
    }
  }, []);

  const loadItems = async (query) => {
    setLoaded(false);
    setError(false);

    const categoriesData = await getCategories();
    if(!categoriesData) {
      setError(true);
      return;
    }

    const ordersData = await getOrders(query);
    if(!ordersData) {
      setError(true);
      return;
    }

    for(let i in ordersData) {
      ordersData[i].modified = false;
      ordersData[i].product = await getProduct(ordersData[i].productId);
      if(!ordersData[i].product) {
        setError(true);
        return;
      }
    }

    setItems(ordersData);
    setCategories(categoriesData);
    setLoaded(true);
  }

  const onItemRemove = async (orderId) => {
    if (window.confirm('Do you really want to remove this order?')) {
      const _items = [...items]; 
      _items.splice(_items.indexOf(order => order.id === orderId), 1);
      await deleteOrder(orderId);
      setItems(_items);
    } 
  }

  const handleChange = (target, orderId) => {
    const _items = [...items];
    const order = _items[_items.findIndex(item => item.id == orderId)];
    order.modified = true;
    order[target.id] = target.value;
    setItems(_items);
    setAnyItemModified(true);
  }

  if(error) {
    return <div>There was an error when loading orders</div>
  }
  else if(!loaded) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" style={{width: "4rem", height: "4rem"}} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    ); 
  } else {
    return (
      <div className="container">
        <table className="table text-light mt-2">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">Count</th>
              <th scope="col">Buyer Id</th>
              <th scope="col">Order Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <OrderListItem key={index} order={item} handleChange={handleChange} onItemRemove={onItemRemove} categories={categories}/>
            ))}
          </tbody>
        </table>
        <OperationButtons onConfirmChangesBtnClick={confirmChanges} anyItemModified={anyItemModified} addNewItemRoute="/orders/new"/> 
      </div>
      );
    }
}
  
export default withRouter(OrdersList);