import './App.css';
import './api'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from "react-router-dom";

import AppSession from './AppSession';

const App = () => <Router><AppSession></AppSession></Router>

export default App;
