import React from 'react';

import { getUser } from './api';
import { Link, Route} from "react-router-dom";

export default class ShopPanelHeader extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: undefined,
        isLoaded: false
      }
    }
  
    async componentDidMount() {
      const user = await getUser();
      this.setState({ 
        user: user,
        isLoaded: true
      });
    }
  
    render() {
      const { user, isLoaded } = this.state;

      if(isLoaded) {
        return (
        <div className="container py-2">
          <div className="d-flex">
            <div className="d-flex flex-row" style={{width: "80vw"}}>
              <h1 className="text-light"><b>Web Shop Panel</b></h1>
            </div>
              <button className="btn btn-danger float-right btn-sm" style={{height: "50%"}}>Log Off</button>
          </div>
          <div className="pb-2 text-light">Logged as: <b>{user.name}</b></div>
          </div>
        );
      }
      else {
        return "Loading...";
      }
    }
  }