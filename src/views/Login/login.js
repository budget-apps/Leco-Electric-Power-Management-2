import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {auth} from '../../firebase'
import swal from 'sweetalert'
import Background from './login1.jpg'

var sectionStyle = {
    width: "100%",
    height: "800px",
    backgroundImage: "url(" +Background+ ")",
    backgroundPosition:"center",
    backgroundRepeat:"no-repeat",
    backgroundSize:"cover"
};

class Login extends React.Component{
    constructor(){
        super()
        this.state={
email:'',
password:''
        }
    }
    

     onEmailChange = e => {
        this.setState({ email: e.target.value });
      };
     onPasswordChange = e => {
        this.setState({ password: e.target.value });
      };
     onSubmit = e => {
        e.preventDefault();
        this.handleSubmit({
          email: this.state.email,
          password: this.state.password,
        }).catch(err => {
          this.setState({ error: err.message });
        });
      };
      handleSubmit = ({ email, password }) => {
        return auth
          .doSignInWithEmailAndPassword(email, password)
          .then(response => {
            console.log('Successful Sign In', response);
            this.props.history.push('/admin');
          })
          .catch(err => {
            console.log('Failed Sign In', err);
            swal("Oops!", "Failed Sign In!", "error");

            throw err;
          })
        }
    render(){

        return(
            <div style={sectionStyle}>
            <div>

            </div>
            <Container style={{padding: 10,}} component="main" maxWidth="xs">

            <CssBaseline />

            <div style={{display: 'flex', alignItems:'center', height: '100vh'}}>

              <form  noValidate onSubmit={this.onSubmit} style={{backgroundColor:'rgba(247, 247, 247, 0.8)',borderRadius: "25px"}} >
                  <div style={{ alignItems:'center'}}>
                  <Avatar >
                      <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                      Sign in
                  </Typography>
                  </div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={this.state.email}
                onChange={this.onEmailChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this.onPasswordChange}
                  />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </Button>
              </form>
            </div>
           
          </Container>
            </div>
        )
    }
}
export default Login