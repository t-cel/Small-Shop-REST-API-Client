import React from 'react';

import { Link } from "react-router-dom";

const ModificationAlert = (props) => {
  if(props.error) {
    return (
      <div className="alert alert-danger" role="alert">
        There was an error when trying to save changes. Checks if fields' values are valid.
      </div>
    );
  } else if(props.anyItemModified) {
    return (
      <div className="alert alert-warning" role="alert">
        Click Confirm Changes button to save changes
      </div>
    );
  }

  return (
    <div className="alert alert-success" role="alert">
      All Changes Saved.
    </div>
  );
}

const OperationButtons = (props) => {
  return (
    <div className="container my-2">
    <ModificationAlert anyItemModified={props.anyItemModified} error={props.error}/>
    <div className="d-flex flex-row my-2">
      <Link to={props.addNewItemRoute} style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
        <div className="btn btn-primary btn-lg" style={{width: "100%"}}>
          Add New
        </div>
      </Link> 
      <button type="button" className="btn btn-primary btn-lg ml-2" style={{width: "100%"}} onClick={props.onConfirmChangesBtnClick}>Confirm Changes</button>
    </div>
  </div>
  );
}

export default OperationButtons;