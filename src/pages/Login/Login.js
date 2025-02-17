import InputText from '../../components/UI/InputText/InputText';
import InputButton from '../../components/UI/InputButton/InputButton';
import { useHistory } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import httpservice from '../../service/httpService';
import classes from './Login.module.css';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';


const Login = () => {
	const dispatch = useDispatch();
	const [cookies, setCookie] = useCookies(['name']);

	const [email, setUserName] = useState();
	const [latitude, setlat] = useState();
	const [longitude, setLong] = useState();
	const [password, setPassword] = useState();
	const [error, ErrorMessage] = useState('');
	const tokenString = sessionStorage.getItem('token');
	const history = useHistory();
	if(tokenString != null){
		history.push("/dashboard");
	}

	const serv = new httpservice();

	
	const handleSubmit = async(e) => {
		e.preventDefault();
		navigator.geolocation.getCurrentPosition( async function(position) {
			const user_id = sessionStorage.getItem('user_id');
			serv.updateUser({id:user_id,latitude:position.coords.latitude,longitude:position.coords.longitude}).then((resp)=>{
				const status = resp.data.success;
		
				  }).catch((error)=>{
				  });


		  });
		let user = {email,password,latitude,longitude};
		console.log(user)
        serv.authUser(user).then((resp)=>{
			const status = resp.data.success;
			if(!status){
				ErrorMessage(resp.data.message);
			}else{
				dispatch({type: "loginSuccess", userDet: resp.data});
				setCookie('token', resp.data.token, { path: '/' });
				sessionStorage.setItem('type',resp.data.type );
				sessionStorage.setItem('user_id',resp.data.user_id );
				sessionStorage.setItem('name',resp.data.name );
				history.push("/dashboard");
			}
        }).catch((error)=>{
            ErrorMessage(`Error Occured ${error}`) ; 
        });
	}
	const emailAttr = {"variant": "outlined", "margin": "normal", "required": true, "fullWidth": true, "id": "email", "label": "Email Address", "name": "email", "autoComplete": "email", "autoFocus": true};
	const passwordAttr = {"variant": "outlined", "margin": "normal", "required": true, "fullWidth": true, "name": "password", "label": "Password", "type": "password", "id": "password", "autoComplete": "current-password"};
	const button = {"type": "submit", "fullWidth": true, "variant": "contained", "color": "primary", "className": classes.submit};

	return (
		<Container component="main" maxWidth="xs">
	      	<CssBaseline />
	      	<div className={classes.paper}>
	        	<Avatar className={classes.avatar}>
	          		<LockOutlinedIcon className={classes.largeIcon} />
	        	</Avatar>
	        	
	        	<Typography component="h1" variant="h5"> Sign in </Typography>
				{error}
		        <form className={classes.form} id="login" onSubmit={handleSubmit} noValidate>
		          	<InputText attributes={emailAttr} onChange={setUserName}/>
		          	<InputText attributes={passwordAttr} onChange={setPassword}/>

		          	<FormControlLabel
		            	control={<Checkbox value="remember" color="primary" />}
		            	label="Remember me"
		          	/>

		          	<InputButton attributes={button}>Login</InputButton>
		          
		           </form>
	      	</div>
	    </Container>
	);
	
}

export default Login;