import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({userId: event.target.value})
  }

  onChangePassword = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  userIdFunction = () => {
    const {userId} = this.state

    return (
      <>
        <label className="user-id-label" htmlFor="username">
          User ID
        </label>
        <br />
        <input
          className="user-id"
          type="text"
          id="username"
          placeholder="Enter User ID"
          value={userId}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  loginPin = () => {
    const {pin} = this.state
    return (
      <>
        <label className="user-id-label" htmlFor="password">
          PIN
        </label>
        <br />
        <input
          className="user-id"
          type="password"
          id="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-card">
          <img
            className="login-image"
            alt="website login"
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
          />
          <form className="welcome-login-card" onSubmit={this.submitForm}>
            <h1 className="welcome-heading">Welcome Back!</h1>
            <div className="user-id-container">{this.userIdFunction()}</div>
            <div className="pin-container">{this.loginPin()}</div>
            <button className="login-button" type="submit">
              Login
            </button>
            {showSubmitError && <p className="error-message">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
