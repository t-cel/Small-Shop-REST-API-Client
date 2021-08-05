import React, { useEffect, useState } from 'react';
import ShopPanelLogo from './ShopPanelLogo';

import { Link } from 'react-router-dom';

import { getUser, logOff } from './api';

const ShopPanelHeader = () => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    async function fetchUser() {
      let _error = false;
      const user = await getUser().catch(e => {
        alert("There was an error during user data fetch");
        _error = true;
      });
      if(!_error)
        setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="container py-2">
      <div className="d-flex">
        <ShopPanelLogo/>
        <Link to="/login" style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
          <button className="btn btn-danger float-right btn-sm" style={{height: "50%"}} onClick={logOff}>Log Off</button>
        </Link>
      </div>
      <div className="pb-2 text-light">Logged as: <b>{user ? user.name : "Loading..."}</b></div>
    </div>
  );
}

export default ShopPanelHeader;