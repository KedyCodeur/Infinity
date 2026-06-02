import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Keyboard } from 'react-native';

export const Scanner = (handleScan) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('onBarcodeScanned', (barcode) => {

      if (!isProcessing) {
        handleScan(barcode);
      }
    });

    return () => listener.remove();
  }, []);

  const startProcessing = () => setIsProcessing(true);
  const stopProcessing = () => {
    setIsProcessing(false);
    Keyboard.dismiss();
  };

  return { isProcessing, startProcessing, stopProcessing };
};

const { isProcessing, startProcessing, stopProcessing } = useBarcodeScanner(async (barcode) => {
    startProcessing();
    await handleGetLabelData(barcode); 
    stopProcessing();
  });