import React, { useEffect, useState } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ShopPanelLogo from './ShopPanelLogo';

import { getUser, setCredidentials } from './api'

function LoginPanel(props) {
    
    const [fields, setFields] = useState({ email: "", password: "" });
    const [error, setError] = useState();

    function handleChange({target}) {
        const _fields = fields;
        _fields[target.name] = target.value;
        setFields(_fields);
    }

    async function onLogInBtnClick() {
        const { email, password } = fields;
        setCredidentials(email, password);
        const user = await getUser();
        if(!user) {
            setError("Wrong email or password");
        }
        else {
            props.history.push('/products');
        }
    }

    useEffect(async () => {
        const user = await getUser();
        if(!(user instanceof Error)) {
            props.history.push('/products');
        }    
    })

    return (
        <div className="container">
            <div className="d-flex">
                <ShopPanelLogo/>
            </div>
            <hr></hr>
            <div className="form-row">
                <div className="form-group col">
                    <label htmlFor="email">Email</label>
                    <input 
                        className="form-control" 
                        type="text" 
                        onChange={handleChange} 
                        id="email"
                        name="email" 
                        placeholder="Email" 
                    >
                    </input>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label htmlFor="password">Password</label>
                    <input 
                        className="form-control" 
                        type="password" 
                        onChange={handleChange} 
                        id="password"
                        name="password" 
                        placeholder="Password" 
                    >
                    </input>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <button className="btn btn-primary" onClick={onLogInBtnClick}>Log In</button>
                    <div className="text-danger mt-2">{error}</div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(LoginPanel);