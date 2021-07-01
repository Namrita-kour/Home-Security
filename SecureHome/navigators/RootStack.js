import * as React from 'react';

import { Colors } from './../components/style';
const {primary,tertiary}=Colors;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';

//credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({storedCredentials}) => (
        <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
              headerStyle:{
                  backgroundColor:'transparent'
              },
              headerTintColor:tertiary,
              headerTransparent:'true',
              headerTitle:'',
              headerLeftContainerStyle:{
                  paddingLeft:20
              }
          }}
          initialRouteName="Login"
        >
        {storedCredentials ?(
          <Stack.Screen name="Welcome" component={Welcome} />
          ): (
          <>
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
          
        </Stack.Navigator>
      </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
    
  );
};

export default RootStack;