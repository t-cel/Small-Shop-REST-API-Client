import React, { useState } from 'react';

export const ProductFilterSortBySelectInput = (props) => {
  return (
    <div>
      <label htmlFor="sortBy">Sort By</label>
      <select defaultValue="name" id="sortBy" className="form-control" onChange={props.handleChange}>
        <option value="name">Name</option>
        <option value="price">Price </option>
        <option value="count">Count</option>
      </select>
    </div>
  )
}