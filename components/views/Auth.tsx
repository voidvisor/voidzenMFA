/**
 * @format
 */

import React from 'react';
import {
  FlatList,
  View,
} from 'react-native';
import { authStyle as style } from '../core/Style';
import { Button, Divider, FAB, Headline, Subheading, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBiometrics from 'react-native-biometrics';
import EncryptedStorage from 'react-native-encrypted-storage';
import Account from '../Account';

const rnBiometrics = new ReactNativeBiometrics();

const Auth = ({auth, setAuth, setBack, navigation}) => {
  const [accList, setAccList] = React.useState([]);
  const [fabOpen, setFabOpen] = React.useState({open: false});

  const fabStateChange = ({open}) => setFabOpen({open});

  const { colors } = useTheme();

  const promptBiometrics = async () => {
    if (auth === false) {
      try {
        const { success } = await rnBiometrics.simplePrompt({promptMessage: 'Unlock Authenticator'});
        setAuth(success);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const retrieveList = async () => {
    if (auth === true) {
      try {
        const list = await EncryptedStorage.getItem('list');
        if (list) {
          setAccList(JSON.parse(list));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  React.useEffect(() => {
    promptBiometrics();
    retrieveList();

    const focus = navigation.addListener('focus', () => {
      setBack(false);
      retrieveList();
    })

    return focus;
  }, [auth, navigation])

  const renderAuth = ({ item }) => (
    <Account uuid={item.uuid} />
  )

  if (auth) {
  return (
    <>
    <FlatList contentContainerStyle={style.flatListContainer} renderItem={renderAuth} data={accList} ItemSeparatorComponent={() => {return (<Divider />)}} ListEmptyComponent={
      <View style={style.lockedView}>
        <Icon name='help' size={200} color={colors.accent} />
        <Headline>It's empty here.</Headline>
        <Subheading>Add some accounts using the plus button!</Subheading>
      </View>
    } />
    <FAB.Group
      visible
      open={fabOpen.open}
      icon={fabOpen.open ? 'close' : 'plus'}
      backdropColor='rgba(0,0,0,0.5)'
      actions={[
        {icon: 'camera', label: 'Scan QR Code', onPress: () => {}},
        {icon: 'plus', label: 'Enter Secret Manually', onPress: () => {navigation.navigate('Manual');setBack(true)}},
      ]}
      onStateChange={fabStateChange}
    />
    </>
  )
  } else {
    return (
      <View style={style.lockedView}>
        <Icon name='lock' size={200} color={colors.accent} />
        <Headline style={style.lockedHeadline}>Authenticator Locked</Headline>
        <Button mode='contained' dark={true} onPress={() => promptBiometrics()}>PRESS TO UNLOCK</Button>
      </View>
    )
  }
}

export default Auth;