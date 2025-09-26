
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getBazi } from '../utils/bazilUtils';

type IntroNav = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

export default function Intro() {
  const navigation = useNavigation<IntroNav>();

  const [selected, setSelected] = useState<Date>(new Date());

  // Android flags
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // iOS modal handling
  const [iosMode, setIosMode] = useState<'date' | 'time' | null>(null);
  const [iosTemp, setIosTemp] = useState<Date>(new Date());

  // Formatters
  const formattedDate = selected.toLocaleDateString();
  const formattedTime = selected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Open handlers
  const openDate = () => {
    if (Platform.OS === 'ios') {
      setIosTemp(selected);
      setIosMode('date');
    } else {
      setShowDate(true);
    }
  };

  const openTime = () => {
    if (Platform.OS === 'ios') {
      setIosTemp(selected);
      setIosMode('time');
    } else {
      setShowTime(true);
    }
  };

  // ANDROID onChange
  const onAndroidDate = (e: DateTimePickerEvent, date?: Date) => {
    setShowDate(false);
    if (e.type === 'set' && date) {
      const next = new Date(selected);
      next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setSelected(next);
    }
  };

  const onAndroidTime = (e: DateTimePickerEvent, date?: Date) => {
    setShowTime(false);
    if (e.type === 'set' && date) {
      const next = new Date(selected);
      next.setHours(date.getHours(), date.getMinutes());
      setSelected(next);
    }
  };

  // iOS confirm/cancel
  const confirmIOS = () => {
    if (!iosMode) return;
    const next = new Date(selected);
    if (iosMode === 'date') {
      next.setFullYear(iosTemp.getFullYear(), iosTemp.getMonth(), iosTemp.getDate());
    } else {
      next.setHours(iosTemp.getHours(), iosTemp.getMinutes());
    }
    setSelected(next);
    setIosMode(null);
  };
  const cancelIOS = () => setIosMode(null);

  // Submit
  const handleSubmit = () => {
    const y = selected.getFullYear();
    const m = selected.getMonth() + 1;
    const d = selected.getDate();
    const h = selected.getHours();
    const result = getBazi(y, m, d, h);
    navigation.navigate('Profile', { baziResult: result });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give me your birthday</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.pickerBox} onPress={openDate}>
          <Text style={styles.boxLabel}>Date</Text>
          <Text style={styles.boxValue}>{formattedDate}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerBox} onPress={openTime}>
          <Text style={styles.boxLabel}>Time</Text>
          <Text style={styles.boxValue}>{formattedTime}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {/* ANDROID pickers */}
      {Platform.OS === 'android' && showDate && (
        <DateTimePicker
          value={selected}
          mode="date"
          display="calendar"
          onChange={onAndroidDate}
        />
      )}
      {Platform.OS === 'android' && showTime && (
        <DateTimePicker
          value={selected}
          mode="time"
          display="clock"
          is24Hour
          onChange={onAndroidTime}
        />
      )}

      {/* iOS modal */}
      {Platform.OS === 'ios' && iosMode && (
        <Modal transparent animationType="fade" onRequestClose={cancelIOS}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {iosMode === 'date' ? 'Select Date' : 'Select Time'}
              </Text>

              <DateTimePicker
                value={iosTemp}
                mode={iosMode}
                display="spinner"
                onChange={(_, date) => {
                  if (date) setIosTemp(date);
                }}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancel]} onPress={cancelIOS}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.ok]} onPress={confirmIOS}>
                  <Text style={styles.modalBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 28 },
  pickerBox: {
    width: 150,
    height: 70,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#111',
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxLabel: { color: '#888', fontSize: 12, marginBottom: 4 },
  boxValue: { color: '#fff', fontSize: 20, fontWeight: '700' },
  submit: {
    alignSelf: 'center',
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  cancel: { backgroundColor: '#333' },
  ok: { backgroundColor: '#1DB954' },
  modalBtnText: { color: '#fff', fontWeight: '700' },
});
