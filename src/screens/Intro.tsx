// Intro.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { getBazi } from '../utils/bazilUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';

type IntroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Intro'
>;

export default function Intro() {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
     const navigation = useNavigation<IntroScreenNavigationProp>();

    const handleSubmit = () => {
        if (!day || !month || !year || !hour || !minute) {
            alert('Please fill all fields');
            return;
        }

        // Convert values to numbers
        const result = getBazi(
            parseInt(year, 10),
            parseInt(month, 10),
            parseInt(day, 10),
            parseInt(hour, 10)
        );

        navigation.navigate('Profile', { baziResult: result });


        // alert(
        //     `Your BaZi:\n` +
        //     `Year: ${result.bazi.year}\n` +
        //     `Month: ${result.bazi.month}\n` +
        //     `Day: ${result.bazi.day}\n` +
        //     `Hour: ${result.bazi.hour}\n` +
        //     `Zodiac: ${result.zodiac}\n` +
        //     `Season: ${result.season}\n` +
        //     `Element: ${result.dominant_element}`
        // );
    };


    // Generate options
    const days = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    const months = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }));
    const years = Array.from({ length: 100 }, (_, i) => {
        const y = new Date().getFullYear() - i;
        return { label: `${y}`, value: `${y}` };
    });
    const hours = Array.from({ length: 24 }, (_, i) => ({ label: `${i.toString().padStart(2, '0')}`, value: `${i.toString().padStart(2, '0')}` }));
    const minutes = Array.from({ length: 60 }, (_, i) => ({ label: `${i.toString().padStart(2, '0')}`, value: `${i.toString().padStart(2, '0')}` }));

    const renderPicker = (placeholder: string, items: { label: string; value: string }[], value: string, onChange: (val: string) => void) => (
        <View style={styles.pickerContainer}>
            <RNPickerSelect
                onValueChange={onChange}
                items={items}
                placeholder={{ label: placeholder, value: '' }}
                style={pickerSelectStyles}
                value={value}
                useNativeAndroidPickerStyle={false}
                Icon={() => <Ionicons name="chevron-down" size={18} color="white" />}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Give me your birthday</Text>

            <View style={styles.form}>
                {renderPicker('DD', days, day, setDay)}
                {renderPicker('MM', months, month, setMonth)}
                {renderPicker('YYYY', years, year, setYear)}
                {renderPicker('HH', hours, hour, setHour)}
                {renderPicker('mm', minutes, minute, setMinute)}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pickerContainer: {
        width: 90,
        height: 50,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        margin: 5,
        justifyContent: 'center',
        paddingHorizontal: 8,
        backgroundColor: '#111',
    },
    button: {
        backgroundColor: '#1DB954',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center' as const,
        paddingRight: 20, // space for the icon
    },
    inputAndroid: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center' as const,
        paddingRight: 18, // space for the icon
    },
    iconContainer: {
        right: 0,  // ✅ push to far right
        top: 22,
        marginTop: -9, // center vertically (since icon is ~18px)
    },
    placeholder: {
        color: '#666',
    },
};

