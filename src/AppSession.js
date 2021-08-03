import './App.css';
import './api'
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button, Navbar, Nav, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory, withRouter } from "react-router-dom";

import OrdersList from './OrdersList';
import ProductsList from './ProductsList';
import ShopPanelHeader from './ShopPanelHeader';
import NewProductForm from './NewProductForm';
import NewOrderForm from './NewOrderForm';
import ListSwitcher from './ListSwitcher';
import ProductsFilterPanel from './ProductsFilterPanel';
import OrdersFilterPanel from './OrdersFilterPanel';
import LoginPanel from './LoginPanel';

import { getUser } from './api';

const AppSession = (props) => {

  const [ ok, setOk ] = useState(false);
  const history = useHistory();

  const checkUser = async () => {
    const user = await getUser();

    if(user instanceof Error) {
      history.push("/login");
    }

    setOk(true);
}

useEffect(() => {
    console.log("update");
    setOk(false);
    checkUser();
  }, []);

  if(!ok) {
    return (
      <div className="App">Loading...</div>
    );
  } else {
    return (
    <div className="App">
        <Switch>
            <Route exact path="/">

            </Route>

            <Route path="/login">
            <LoginPanel/>
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
            <OrdersFilterPanel/>
            <OrdersList/>
            </Route>

        </Switch>
    </div>
    );
  }
}

export default withRouter(AppSession);
