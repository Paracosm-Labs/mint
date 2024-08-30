'use client'
import React from 'react';

const Login = () => {

    return(
        <main class="d-flex align-items-center py-4 form-signin w-100 m-auto">
            <div>
                <p class="h3 my-3 fw-normal">Welcome to MintDeals</p>
                <p class="mb-3 text-body-secondary">Remember to Login to Tronlink before proceeding!</p>
                <button class="btn btn-primary w-100 py-2" type="submit">Log in</button>
            </div>
        </main>        
    )
}

export default Login;