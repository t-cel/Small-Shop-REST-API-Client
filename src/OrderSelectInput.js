import React, { useState } from 'react';

export const OrderSelectInput = (props) => {
  return (
    <div>
      <label htmlFor="isSortAsc">Order</label>
      <select defaultValue={true} id="isSortAsc" className="form-control" onChange={props.handleChange}>
        <option value={true}>Ascending</option>
        <option value={false}>Descending</option>
      </select>
    </div>
  );
}