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
import {View,ActivityIndicator} from 'react-native';

//API client
import axios from 'axios';

//colors
const {brand,darkLight,primary} = Colors;

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

// icons
import {Octicons,Ionicons,Fontisto} from '@expo/vector-icons';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    //form handling
    const handleSignup =(credentials,setSubmitting) =>{
        handleMessage(null);
        const url = 'https://tranquil-cove-50846.herokuapp.com/user/signup';

        axios
            .post(url,credentials)
            .then((response)=>{
                const result = response.data;
                const {message,status,data} = result;

                if(status !== 'SUCCESS'){
                    handleMessage(message, status);
                }else{
                    persistLogin({...data},message,status);
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
                <SubTitle>Account Signup</SubTitle>
                <Formik
                    initialValues={{name:'',email: '',password: '',confirmPassword:''}}
                    onSubmit={(values,{setSubmitting}) => {
                        if(values.email == '' || values.password == '' || values.name == '' || values.confirmPassword == ''){
                            handleMessage('Please fill all the fields');
                            setSubmitting(false);
                        }
                        else if(values.password !== values.confirmPassword){
                            handleMessage('Passwords do not match');
                            setSubmitting(false);
                        }
                        else{
                            handleSignup(values,setSubmitting);
                        }
                    }}
                >{({handleChange,handleBlur,handleSubmit,values,isSubmitting}) => (<StyledFormArea>
                    <MyTextInput
                        label="UserName"
                        icon="person"
                        placeholder="Username"
                        placeholderTextColor={darkLight}
                        onChangeText ={handleChange('name')}
                        onBlur ={handleBlur('name')}
                        value={values.name}
                    />
                    <MyTextInput
                        label="Email Address"
                        icon="mail"
                        placeholder="nam@gmail.com"
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
                    <MyTextInput
                        label="Confirm Password"
                        icon="lock"
                        placeholder="********"
                        placeholderTextColor={darkLight}
                        onChangeText ={handleChange('confirmPassword')}
                        onBlur ={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                        secureTextEntry={hidePassword}
                        isPassword={true}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                    />
                    <MsgBox type={messageType}>{message}</MsgBox>
                    {!isSubmitting && <StyledButton onPress={handleSubmit}>
                        <ButtonText>SignUp</ButtonText>
                    </StyledButton>}

                    {isSubmitting && <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={primary} />
                    </StyledButton>}
                    
                    <Line />
                    
                    <ExtraView>
                        <ExtraText>Already have an account?</ExtraText>
                        <TextLink onPress={()=>navigation.navigate('Login')}>
                            <TextLinkContent>Login</TextLinkContent>
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

export default Signup;