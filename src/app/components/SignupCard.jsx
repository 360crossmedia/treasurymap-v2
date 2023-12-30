"use client";
import { useState } from 'react'
import { useRouter } from "next/navigation";
import styles from "../styles/signupCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";
import { apiCreateUser } from '../service/apiCreateUser';

const SignupCard = () => {
  const [companyName, setcompanyName] = useState('');
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setconfPassword] = useState('');
  const [passwordMatch, setPasswordsMatch] = useState(true);
  const [respuesta, setRespuesta] = useState(false);
  const [error , setError] = useState('')

  const router = useRouter();

  const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      checkPasswordsMatch(e.target.value, confPassword);
  };

  const handleConfirmPasswordChange = (e) => {
      setconfPassword(e.target.value);
      checkPasswordsMatch(password, e.target.value);
  };

  const checkPasswordsMatch = (pwd1, pwd2) => {
      setPasswordsMatch(pwd1 === pwd2);
  };

  const handleSubmit = async (e) => {
      //e.preventDefault();
      //console.log('prueba click');

      if(!companyName.length || !fullName.length || !email.length || !password.length || !confPassword.length){
          return setError('Complete information')
      }else if(!email.includes('@') || !email.includes('.')  ){
          return setError('Enter valid email')
      }else if(!passwordMatch){
          return setError("Password doesn't match")
      }   

      let datos = { companyName:companyName, fullName: fullName , email: email, password: password }
      //console.log('el user es ');
      //console.log(user);
      //let userJson = JSON.stringify(user)

        try{
            setError('')
            let data = await apiCreateUser(datos)
            //const {message} = data
            //console.log(data);
            //router.push('/');

            if(data == 201){
              //console.log('dio true');
              router.push("/login")

            }else{
              setError('No se puede crear usuario, información incorrecta')
              console.log(data);              
            }

            // if( typeof data =='object' ){
            //     setRespuesta(true)
            //     console.log('Usuario creado');
            //     console.log(data);
            // }else{
            //     setError('No se puede crear usuario, información incorrecta')
            //     console.log(data);
            // }
        }catch(e){
            setError('No se puede crear usuario, información incorrecta')
            console.log(e);
        }      


    };
    

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Sign Up</p>
          <p className={styles.cardDescription}>Welcome to Treasury MAP</p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Company Name"
            type="text"
            value={companyName}
            onChange={(e)=> setcompanyName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input 
            className={styles.input} 
            placeholder="Full Name" 
            type="text" 
            value={fullName}
            onChange={(e)=> setfullName(e.target.value)}            
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}             
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input 
            className={styles.input} 
            placeholder="Password" 
            type="password" 
            value={password}
            onChange={(e)=> handlePasswordChange(e)}               
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Confirm Password"
            type="password"
            value={confPassword}
            onChange={(e)=> handleConfirmPasswordChange(e)}                 
          />
        </div>
        <div>
          <button className={styles.button} onClick={handleSubmit}>Sign in</button>
          { !!error.length && <p className={styles.error}>Error: {error}</p> }          
        </div>
      </div>
    </div>
  );
};

export default SignupCard;
