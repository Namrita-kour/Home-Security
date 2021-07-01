import React,{useState} from 'react';

//react navigation 
import RootStack from './navigators/RootStack';

//app Loading
import AppLoading from 'expo-app-loading';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { CredentialsContext } from './components/CredentialsContext';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  
  const checkLoginCredentials = () =>{
    AsyncStorage.getItem('SecureHomesCredentials')
    .then((result)=>{
      if(result !== null){
        setStoredCredentials(JSON.parse(result));
      }else{
        setStoredCredential(null);
      }
    })
    .catch(error => console.log(error))
  }

  if(!appReady){
    return(
      <AppLoading 
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }

  return (
    <CredentialsContext.Provider value={{storedCredentials,setStoredCredentials}}>
      <RootStack />
    </CredentialsContext.Provider>
  );
}

