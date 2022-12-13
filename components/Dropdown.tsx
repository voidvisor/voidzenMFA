/**
 * @format
 */

import React from "react";
import { Pressable, StyleProp, TextStyle, View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";

interface listItem {
    label: string,
    value: any,
}

interface dropdownProps {
    value: any,
    setValue: Function,
    mode?: 'flat' | 'outlined',
    left?: React.ReactNode,
    disabled?: boolean,
    label?: TextInputLabelProp,
    placeholder?: string,
    error?: boolean,
    underlineColor?: string,
    outlineColor?: string,
    style?: StyleProp<TextStyle>,
    list: Array<listItem>,
}

const Dropdown = (props: dropdownProps) => {
    const {value, setValue, mode, left, disabled, label, placeholder, error, underlineColor, outlineColor, list, style} = props;
    const [menu, setMenu] = React.useState(false);
    const [layout, setLayout] = React.useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    })

    const menuOptions = list.map((item) => 
        <Menu.Item key={item.value} title={item.label} onPress={() => {setValue(item.value);setMenu(false)}} />
    )

    const getLabel = (val) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].value === val) {
                return list[i].label
            }
        }
    }

    return (
        <View style={style}>
            <Menu visible={menu} onDismiss={() => {setMenu(false)}} anchor={<Pressable onLayout={(event) => setLayout(event.nativeEvent.layout)} onPress={() => {setMenu(true)}}>
                    <TextInput label={label} mode={mode} value={getLabel(value)} editable={false} left={left} right={<TextInput.Icon name={menu ? 'menu-up' : 'menu-down'} onPress={() => {setMenu(true)}} />} disabled={disabled} placeholder={placeholder} error={error} underlineColor={underlineColor} outlineColor={outlineColor} />
                </Pressable>} style={{
                    marginTop: layout.height,
                    width: layout.width
                }}>
                {menuOptions}
            </Menu>
        </View>
    )
}

export default Dropdown;