import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    StyledFormArea,
    SubTitle,
    LeftIcon,
    StyledInputLabel,
    StyledButton,
    StyledTextInput,
    RightIcon,
    ButtonText,
    Colors,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent,
} from './../components/style';
import {View, ActivityIndicator} from 'react-native';

//colors
const {brand,darkLight,primary} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

//API client
import axios from 'axios';

import * as Google from 'expo-google-app-auth';

// icons
import {Octicons,Ionicons,Fontisto} from '@expo/vector-icons';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

//import { useContext } from 'react/cjs/react.production.min';

const Login = ({navigation}) =>{
    const [hidePassword, setHidePassword] = useState(true);
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();
    const [googleSubmitting, setGoogleSubmitting] = useState(false);

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin =(credentials,setSubmitting) =>{
        handleMessage(null);
        const url = 'https://tranquil-cove-50846.herokuapp.com/user/signin';

        axios
            .post(url,credentials)
            .then((response)=>{
                const result = response.data;
                const {message,status,data} = result;

                if(status !== 'SUCCESS'){
                    handleMessage(message, status);
                }else{
                    persistLogin({...data[0]},message,status);
                }
                setSubmitting(false);
            })
            .catch(error=>{
                console.log(error.JSON());
                setSubmitting(false); 
                handleMessage("An error has occured. Check your network and try again!");
            });
    };

    const handleMessage = (message, type = "FAILED") => {
        setMessage(message);
        setMessageType(type);
    }

    const handleGoogleSignin = () => {
        setGoogleSubmitting(true);
        const config = {
            iosClientId:'436132279188-gfsj5i210f5190d2o7id6e5dvvviaq55.apps.googleusercontent.com',
            androidClientId:'436132279188-qc54rfev2v9sc5ggs8cft9o4d4us6mq4.apps.googleusercontent.com',
            scopes:['profile', 'email']
        };
        Google
        .logInAsync(config)
        .then((result)=>{
            const{type,user}=result;
            if(type == 'success'){
                const{email,name,photoUrl} = user;
                persistLogin({name,photoUrl}, message, "SUCCESS");
            }else{
                handleMessage('Google signin cancelled');
            }
            setGoogleSubmitting(false);
        })
        .catch(error=>{
            console.log(error);
            handleMessage('An error occured. Check network and try again');
            setGoogleSubmitting(false);
        });
    };

    const persistLogin = (credentials,message,status) =>{
        AsyncStorage.setItem('SecureHomesCredentials',JSON.stringify(credentials))
        .then(()=>{
            handleMessage(message,status);
            setStoredCredentials(credentials);
        })
        .catch((error => {
            console.log(error);
            handleMessage('Persisting login failed');
        }))
    }

    return (
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageLogo resize="cover" source={require('./../assets/img1.jpg')}></PageLogo>
                <PageTitle>Secure Homes</PageTitle>
                <SubTitle>Account Login</SubTitle>
                <Formik
                    initialValues={{email: '',password: ''}}
                    onSubmit={(values, {setSubmitting}) => {
                        if(values.email == '' || values.password == ''){
                            handleMessage('Please fill all the fields');
                            setSubmitting(false);
                        }else{
                            handleLogin(values,setSubmitting);
                        }
                    }}
                >{({handleChange,handleBlur,handleSubmit,values,isSubmitting}) => (<StyledFormArea>
                    <MyTextInput
                        label="Email Address"
                        icon="mail"
                        placeholder="nam@domain.com"
                        placeholderTextColor={darkLight}
                        onChangeText ={handleChange('email')}
                        onBlur ={handleBlur('email')}
                        value={values.email}
                        keyboardType="email-address"
                    />
                    <MyTextInput
                        label="Password"
                        icon="lock"
                        placeholder="********"
                        placeholderTextColor={darkLight}
                        onChangeText ={handleChange('password')}
                        onBlur ={handleBlur('password')}
                        value={values.password}
                        secureTextEntry={hidePassword}
                        isPassword={true}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                    />
                    <MsgBox type={messageType}>{message}</MsgBox>
                    {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                        <ButtonText>Login</ButtonText>
                    </StyledButton>)}

                    {isSubmitting && (
                    <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={primary} />
                    </StyledButton>)}

                    <Line />
                    
                    {!googleSubmitting && (
                    <StyledButton google={true} onPress={handleGoogleSignin}>
                        <Fontisto name="google" color={primary} size={25} />
                        <ButtonText google={true}>Sign in with Google</ButtonText>
                    </StyledButton>)}

                    {googleSubmitting && (
                    <StyledButton google={true} disabled={true}>
                        <ActivityIndicator size="large" color={primary} />
                    </StyledButton>)}
                    <ExtraView>
                        <ExtraText>Don't have an account already?</ExtraText>
                        <TextLink onPress={()=>navigation.navigate("Signup")}>
                            <TextLinkContent>Signup</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </StyledFormArea>
                )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword, ...props}) => {
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off':'md-eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
}

export default Login;