import './App.css';
import './api'
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, Redirect, useHistory, withRouter, useLocation } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer';

import OrdersList from './OrdersList';
import ProductsList from './ProductsList';
import ShopPanelHeader from './ShopPanelHeader';
import NewProductForm from './NewProductForm';
import NewOrderForm from './NewOrderForm';
import ListSwitcher from './ListSwitcher';
import ProductsFilterPanel from './ProductsFilterPanel';
import OrdersFilterPanel from './OrdersFilterPanel';
import LoginPanel from './LoginPanel';
import { LoadingSpinner } from './LoadingSpinner';

import { APIRespondError, getUser, logOff, wasLoggedIn } from './api';

const AppSession = (props) => {
  
  const [ ready, setReady ] = useState(false);
  const [ wasIdle, setWasIdle ] = useState(false);
  const history = useHistory();
  const location = useLocation();
  
  const isOnLoginPage = () => location.pathname === "/login";

  // log off automatically after some time of idle
  const handleOnIdle = event => {
    setWasIdle(true);
    logOff();
  }

  const handleOnActive = event => {}

  // if user makes some action but was idle, redirect to login page
  const handleOnAction = async event => {
    if(wasIdle) {
      history.push("/login");
      setWasIdle(false);
    } else {
      const user = await getUser();
      if(user === APIRespondError && !isOnLoginPage()) {
        alert("API does not respond");
        history.push("/login");
      }
    }
  }

  useIdleTimer({
    timeout: 1000 * 60 * 20, //20 minutes of idle results in auto log off
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
    events: [ 'mouseup' ]
  });

  const checkUser = async () => {
      const user = await getUser();
      if(user instanceof Error) {
        history.push("/login");
      }
      setReady(true);
  }

  //on start/refresh, check if user is logged in
  useEffect(() => {
    setReady(false);
    checkUser();
  }, [history]);

  //on location change check if user was idle, if yes, redirect to login page
  useEffect(() => {
    setReady(false);
    if(location.pathname !== "/login" && (wasIdle || !wasLoggedIn())) {
      history.push("/login");
      setWasIdle(false);
    }
    setReady(true);
  }, [location]);

  if(!ready) {
    return (
      <div className="App">
        <div className="container mt-5">
          <LoadingSpinner/>
        </div>
      </div>
    );
  } else {
    return (
    <div className="App">
        <Switch>
            <Route exact path="/">
              <Redirect to="/login"/>
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