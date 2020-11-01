import React from 'react';
import PropTyeps from 'prop-types';

function Nav(props) {

    const logged_out_nav = (
        <ul>
            <li onClick={() => props.display_form('login')}>login</li>
            <li onClick={() => props.display_form('signup')}>sigup</li>
        
        </ul>
    );

    const logged_in_nav = (
        <ul>
            <li onClick={props.handle_logout}>logout</li>
        </ul>
    );

    return <div>{props.logged_in || props.social_logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;

Nav.propTyeps = {
    logged_in: PropTyeps.bool.isRequired,
    social_logged_in: PropTyeps.bool.isRequired,
    display_form: PropTyeps.func.isRequired,
    handle_logout: PropTyeps.func.isRequired
}

