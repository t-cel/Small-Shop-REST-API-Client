import './App.css';
import './api'
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Button, Navbar, Nav, Container, ListGroup, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";

import AppSession from './AppSession';

const App = () => <Router><AppSession></AppSession></Router>

export default App;
