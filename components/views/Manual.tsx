/**
 * @format
 */

import React from 'react';
import { View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dropdown from '../Dropdown';
import 'react-native-random-uuid';
import { manualStyle as style } from '../core/Style';

const Manual = ({navigation}) => {
    const [name, setName] = React.useState('');
    const [issuer, setIssuer] = React.useState('');
    const [secret, setSecret] = React.useState('');
    const [totp, setTotp] = React.useState(true);
    const [algorithm, setAlgorithm] = React.useState(1);
    const [period, setPeriod] = React.useState('30');
    const [numbers, setNumbers] = React.useState('6');
    const [counter, setCounter] = React.useState('0');

    const totpList = [
        {
            label: 'TOTP',
            value: true,
        },
        {
            label: 'HOTP',
            value: false,
        },
    ]

    const algoList = [
        {
            label: 'SHA-1',
            value: 1,
        },
        {
            label: 'SHA-256',
            value: 256,
        },
        {
            label: 'SHA-512',
            value: 512,
        },
    ]

    const findIcon = () => {
        if (Icon.hasIcon(issuer.toLowerCase())) {
            return issuer.toLowerCase();
        } else {
            if (issuer) {
                return issuer[0];
            } else {
                return name[0];
            }
        }
    }

    const checkEncoding = () => {
        const b32_regex = /^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}={0,6}|[A-Z2-7]{4}={0,4}|[A-Z2-7]{5}={0,3}|[A-Z2-7]{7}=?)?$/;

        if (b32_regex.exec(secret)) {
            return 'base32';
        } else {
            return 'ascii';
        }
    }

    const submitForm = async () => {
        // @ts-expect-error
        const uuid = crypto.randomUUID();
        try {
            await EncryptedStorage.setItem(
                uuid,
                JSON.stringify({
                    icon: findIcon(),
                    issuer: issuer,
                    account: name,
                    secret: secret,
                    encoding: checkEncoding(),
                    digits: parseInt(numbers),
                    period: parseInt(period),
                    counter: parseInt(counter),
                    totp: totp,
                })
            )
        } catch (err) {
            console.error(err)
        }
        try {
            let list = await EncryptedStorage.getItem('list');
            
            if (list) {
                let parsedList = JSON.parse(list);
                parsedList.push({uuid: uuid})
                try {
                    await EncryptedStorage.setItem(
                        'list', 
                        JSON.stringify(parsedList)
                    )
                } catch (err) {
                    console.error(err);
                }
            } else {
                try {
                    await EncryptedStorage.setItem(
                        'list',
                        JSON.stringify([{uuid: uuid}])
                    )
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (err) {
            console.error(err);
        }
        navigation.navigate('Auth');
    }

    return (
        <View style={style.flex}>
            <View style={style.inputView}>
                <TextInput style={style.wide} mode='outlined' label='Name' value={name} onChangeText={text => setName(text)} />
                <TextInput style={style.wide} mode='outlined' label='Issuer' value={issuer} onChangeText={text => setIssuer(text)} />
                <TextInput style={style.wide} mode='outlined' label='Secret' value={secret} onChangeText={text => setSecret(text)} />
                <Dropdown style={style.half} label='Type' mode='outlined' list={totpList} value={totp} setValue={setTotp} />
                <Dropdown style={style.half} label='Algorithm' mode='outlined' list={algoList} value={algorithm} setValue={setAlgorithm} />
                {totp ? <TextInput style={style.half} mode='outlined' label='Period' keyboardType='numeric' value={period} onChangeText={text => setPeriod(text.replace(/[^0-9]/g, ''))} /> : <TextInput style={{flexBasis: '48%'}} mode='outlined' label='Counter' keyboardType='numeric' value={counter} onChangeText={text => setCounter(text.replace(/[^0-9]/g, ''))} />}
                <TextInput style={style.half} mode='outlined' label='Numbers' keyboardType='numeric' value={numbers} onChangeText={text => setNumbers(text.replace(/[^0-9]/g, ''))} />
            </View>
            <Button style={style.submit} mode='contained' onPress={() => submitForm()}>
                Save
            </Button>
        </View>
    )
}

export default Manual;