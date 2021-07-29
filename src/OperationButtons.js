import React from 'react';

import { Link } from "react-router-dom";

class ModificationAlert extends React.Component {
    render() {
        if(this.props.anyItemModified) {
        return (
            <div className="alert alert-warning" role="alert">
            Click Confirm Changes button to save changes
            </div>
        );
        } else {
        return (
            <div className="alert alert-success" role="alert">
            All Changes Saved.
            </div>
        );
        }
    }
}

export default class OperationButtons extends React.Component {
    render() {
      return (
        <div className="container my-2">
          <ModificationAlert anyItemModified={this.props.anyItemModified}/>
  
          <div className="d-flex flex-row my-2">
            <Link to={this.props.addNewItemRoute} style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
              <div className="btn btn-primary btn-lg" style={{width: "100%"}}>
                Add New
              </div>
            </Link> 

            {/* <button type="button" className="btn btn-primary btn-lg" style={{width: "50%"}}>Add New</button> */}
            <button type="button" className="btn btn-primary btn-lg ml-2" style={{width: "100%"}} onClick={this.props.onConfirmChangesBtnClick}>Confirm Changes</button>
          </div>
        </div>
      );
    }
}
  