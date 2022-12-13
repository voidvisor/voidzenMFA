/**
 * @format
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { Appbar, IconButton, useTheme } from 'react-native-paper';
import Auth from './Auth';
import Manual from './Manual';
import { authStyle as style } from '../core/Style';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    const [authStatus, setAuth] = React.useState(false);
    const [showBack, setBack] = React.useState(false);
    const navigation = useNavigation();

    const { colors } = useTheme();

    return (
        <>
        {authStatus &&
            <Appbar.Header style={style.header}>
                {showBack &&
                    // @ts-expect-error
                    <IconButton icon='close' color={colors.surface} onPress={() => {navigation.navigate('Auth')}} />
                }
                {/*@ts-expect-error*/}
                <Appbar.Action icon="lock" color={colors.surface} onPress={() => {setAuth(false);navigation.navigate('Auth')}} style={style.lockButton} />
            </Appbar.Header>
        }
        <Stack.Navigator initialRouteName='Auth' screenOptions={{headerShown: false}}>
            <Stack.Screen name='Auth'>
                {(props) => <Auth {...props} auth={authStatus} setAuth={setAuth} setBack={setBack} />}
            </Stack.Screen>
            <Stack.Screen name='Manual'>
                {(props) => <Manual {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
        </>
    )
}

export default AuthStack;