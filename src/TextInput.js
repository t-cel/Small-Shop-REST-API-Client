import React, { useState } from 'react';

export const TextInput = (props) => {
  return (
    <div style={{width: "100%"}}>
      <label htmlFor={props.id}>{props.text}</label>
      <input 
        className="form-control" 
        type={props.password ? "password" : "text"} 
        onChange={props.handleChange} 
        id={props.id}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
      ></input>
      <div className="text-danger">{props.errors ? props.errors[props.id] : ""}</div>
    </div>
  );
}