// src/screens/Profile.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import QRCode from 'react-native-qrcode-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<ProfileNavProp>();
  const { baziResult } = route.params;

  const [showQR, setShowQR] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your BaZi Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Year Pillar:</Text>
        <Text style={styles.value}>
          {baziResult.pillars[0].pillar} → {baziResult.pillars[0].stemIcon}
          {baziResult.pillars[0].branchIcon}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Month Pillar:</Text>
        <Text style={styles.value}>
          {baziResult.pillars[1].pillar} → {baziResult.pillars[1].stemIcon}
          {baziResult.pillars[1].branchIcon}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Day Pillar:</Text>
        <Text style={styles.value}>
          {baziResult.pillars[2].pillar} → {baziResult.pillars[2].stemIcon}
          {baziResult.pillars[2].branchIcon}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Hour Pillar:</Text>
        <Text style={styles.value}>
          {baziResult.pillars[3].pillar} → {baziResult.pillars[3].stemIcon}
          {baziResult.pillars[3].branchIcon}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Zodiac:</Text>
        <Text style={styles.value}>{baziResult.zodiac}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Season:</Text>
        <Text style={styles.value}>{baziResult.season}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Dominant Element:</Text>
        <Text style={styles.value}>
          {baziResult.dominant_element} {baziResult.dominant_icon}
        </Text>
      </View>

      {/* Button to open QR modal */}
      <TouchableOpacity style={styles.ctaButton} onPress={() => setShowQR(true)}>
        <Text style={styles.ctaText}>Generate My Match QR</Text>
      </TouchableOpacity>

      {/* Modal with QR Code */}
      <Modal visible={showQR} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan this QR to check compatibility</Text>

            <QRCode
              value={JSON.stringify({
                dominant: baziResult.dominant_element,
                zodiac: baziResult.zodiac,
              })}
              size={200}
              color="black"
              backgroundColor="white"
            />

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowQR(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: '#FF6B6B' }]}
        onPress={() =>
          navigation.navigate('Scan', { myDominant: baziResult.dominant_element })
        }
      >
        <Text style={styles.ctaText}>Scan a Match QR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:40,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  label: { color: '#aaa', fontSize: 18 },
  value: { color: '#fff', fontSize: 18, fontWeight: '600' },

  ctaButton: {
    marginTop: 20,
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
