import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import fbLogin from "./services/fbLogin"
import './App.css';

class App extends Component {

  render() {
    const responseFacebook = async (response) => {
      let fbResponse  = await fbLogin(response.accessToken);
      fetch('http://localhost:8000/dj-rest-auth-origin/user/', {
            headers: {
              Authorization: `Token ${fbResponse}`
            }
          })
            .then(res => res.json())
            .then(json => {
              this.setState({
                social_logged_in: true,
                displayed_form: '',
                username: json.username
              });
              localStorage.setItem('social_token', fbResponse);
            });
    }


    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    let social;
    if (!this.state.logged_in && !this.state.social_logged_in) {
      social = <FacebookLogin
                  appId="676006239692997"
                  fields="name,email,picture"
                  callback={responseFacebook}
                />;
    } else {
      social = null;
    }

    let list_users;
    if (this.state.logged_in) {
      list_users = <button onClick={() => {
        if (this.state.logged_in) {
          fetch('http://localhost:8000/dj-rest-auth/list_users/', {
            headers: {
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(res => res.json())
            .then(json => {
              let tmpArray = []
              for (var i = 0; i < json.length; i++) {
                tmpArray.push(json[i].username + "\n");
              }
              this.setState({usernameList: tmpArray});
            });
        } else {
          this.setState({usernameList: "Unauthorized, could not show users"});
        }
        
        }}>listUser</button>;
    }

    if (this.state.social_logged_in) {
      list_users = <button onClick={() => {
        if (this.state.social_logged_in) {
          fetch('http://localhost:8000/dj-rest-auth/list_users/', {
            headers: {
              Authorization: `Token ${localStorage.getItem('social_token')}`
            }
          })
            .then(res => res.json())
            .then(json => {
              let tmpArray = []
              for (var i = 0; i < json.length; i++) {
                tmpArray.push(json[i].username + "\n");
              }
              this.setState({usernameList: tmpArray});
            });
        } else {
          this.setState({usernameList: "Unauthorized, could not show users"});
        }
        
        }}>listUser</button>;
    }

    return (
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          social_logged_in={this.state.social_logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        <h3>
          {this.state.logged_in || this.state.social_logged_in
            ? `Hello, ${this.state.username}`
            : 'Please Log In'}
        </h3>

        {form}
        <br></br>
        <br></br>
        {social}
        <br></br>
        <br></br>
        {list_users}
        <br></br>
        {this.state.usernameList}
      </div>
    );
  }

  constructor(props) {
    super(props);
    console.log("props");
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      social_logged_in: localStorage.getItem('social_token') ? true : false,
      username: ''
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/dj-rest-auth/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
    }
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
      });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/dj-rest-auth/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('social_token');
    this.setState({ logged_in: false, username: '', usernameList: '', social_logged_in: false });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

}

export default App;