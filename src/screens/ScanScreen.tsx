// src/screens/ScanScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { getPerfectMatch, ELEMENT_ICONS } from '../utils/bazilUtils';

type ScanRouteProp = RouteProp<RootStackParamList, 'Scan'>;

export default function ScanScreen() {
  const route = useRoute<ScanRouteProp>();
  const { myDominant } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // prevent double scans
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      const theirDominant = parsed.dominant;

      const match = getPerfectMatch(myDominant);

      if (theirDominant === match.best) {
        setResult(`💞 Perfect Match: ${theirDominant} ${ELEMENT_ICONS[theirDominant]}`);
      } else if (theirDominant === match.good) {
        setResult(`👍 Good Match: ${theirDominant} ${ELEMENT_ICONS[theirDominant]}`);
      } else if (theirDominant === match.conflict) {
        setResult(`💥 Challenging Match: ${theirDominant} ${ELEMENT_ICONS[theirDominant]}`);
      } else {
        setResult(`🤝 Neutral Match: ${theirDominant} ${ELEMENT_ICONS[theirDominant]}`);
      }
    } catch {
      setResult('❌ Invalid QR Code');
    }
  };

  if (!permission) {
    return <Text style={styles.text}>Requesting camera permission…</Text>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!scanned ? (
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        />
      ) : (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { flex: 1, textAlign: 'center', textAlignVertical: 'center', color: '#fff' },
  resultBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  resultText: { color: '#fff', fontSize: 20, textAlign: 'center', marginBottom: 20 },
});
