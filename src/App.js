import './App.css';
import './api'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button, Navbar, Nav, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import OrdersList from './OrdersList';
import ProductsList from './ProductsList';
import ShopPanelHeader from './ShopPanelHeader';
import NewProductForm from './NewProductForm';
import NewOrderForm from './NewOrderForm';
import ListSwitcher from './ListSwitcher';
import ProductsFilterPanel from './ProductsFilterPanel';

class App extends React.Component {
  render(){
    return (
    <div className="App">
    <Router>
      <Switch>
        <Route exact path="/">

        </Route>

        <Route path="/products/new">
          <ShopPanelHeader/>     
          <NewProductForm/>     
        </Route>

        <Route path="/products/:id">
          <ShopPanelHeader/>   
          <ListSwitcher/>  
          <ProductsList/>    
        </Route>  

        <Route path="/products">
          <ShopPanelHeader/>
          <ListSwitcher/>
          <ProductsFilterPanel/>
          <ProductsList/>
        </Route>

        <Route path="/orders/new">
          <ShopPanelHeader/> 
          <NewOrderForm/>
        </Route>

        <Route path="/orders">
          <ShopPanelHeader/>
          <ListSwitcher/>
          <OrdersList/>
        </Route>

      </Switch>
    </Router>
    </div>
    );
  }
}

export default App;
