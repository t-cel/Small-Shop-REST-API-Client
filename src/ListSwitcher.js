import React from 'react';

import { Link } from "react-router-dom";

const ListSwitcher = () => 
  <div className="container py-2">
    <div className="d-flex flex-row mx-2">                      
      <Link to="/products" style={{ textDecoration: 'none', color: 'white', width:"100%" }}>
        <div className="btn btn-secondary active" style={{width: "99%"}}>
          Products
        </div>
      </Link>
      <Link to="/orders" style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
        <div className="btn btn-secondary active float-right" style={{width: "99%"}}>
          Orders
        </div>
      </Link> 
    </div>
  </div>

export default ListSwitcher;