import React, { useEffect, useState } from 'react';
import ShopPanelLogo from './ShopPanelLogo';

import { getUser } from './api';

const ShopPanelHeader = () => {
  const [user, setUser] = useState();
  
  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      if(user)
        setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <div className="container py-2">
      <div className="d-flex">
        <ShopPanelLogo/>
        <button className="btn btn-danger float-right btn-sm" style={{height: "50%"}}>Log Off</button>
      </div>
      <div className="pb-2 text-light">Logged as: <b>{user ? user.name : "Loading..."}</b></div>
    </div>
  );
}

export default ShopPanelHeader;