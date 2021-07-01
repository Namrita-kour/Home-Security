import React, {useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    InnerContainer,
    PageTitle,
    StyledFormArea,
    SubTitle,
    LeftIcon,
    StyledInputLabel,
    StyledButton,
    StyledTextInput,
    RightIcon,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar,
} from './../components/style';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';


const Welcome = () => {
    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {name,email,photoUrl} = storedCredentials;
    const AvatarImg = photoUrl ? {uri:photoUrl}: require('./../assets/img1.jpg')

    const clearLogin =() =>{
        AsyncStorage.removeItem('SecureHomeCredentials')
        .then(()=>{
            setStoredCredentials("");
        })
        .catch((error)=> console.log(error))
    }

    return (
        <>
            <StatusBar style="dark" />
            <InnerContainer>
            
            <WelcomeContainer>
                <PageTitle welcome={true}>Welcome</PageTitle>
                <SubTitle welcome={true}>{name || 'Name'}</SubTitle>
                
                    <StyledFormArea>
                    <Avatar resizeMode="cover" source={AvatarImg} />
                        <Line />
                        
                        <StyledButton onPress={clearLogin}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                        
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};


export default Welcome;