
import { useRef, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useFocusEffect } from 'expo-router';

const useHandleScanner = (onScan, inputRef) => {
  const onScanRef = useRef(null);
  onScanRef.current = onScan;

  useFocusEffect(
    useCallback(() => {
      const listener = DeviceEventEmitter.addListener('onBarcodeScanned', (barcode) => {
        onScanRef.current(barcode);
      });
      return () => {
        listener.remove();
        if (inputRef?.current) {
          inputRef.current.blur();
        }
      };
    }, [])
  );
};

export default useHandleScanner;