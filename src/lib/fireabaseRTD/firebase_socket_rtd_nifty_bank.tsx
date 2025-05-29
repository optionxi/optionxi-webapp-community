import { DataStockModel } from '@/datamodels/stock_model';
import { db2 } from '@/utils/firebaseConfig';
import { ref, onValue, DataSnapshot, DatabaseReference } from 'firebase/database';

// Function to parse stock data from snapshot
const parseStockData = (snapshot: DataSnapshot): DataStockModel | null => {
  const data = snapshot.val();
  if (data && typeof data === 'object') {
    return {
      close: data.close ?? 0,
      pclose: data.pclose ?? 0,
      high: data.high ?? 0,
      low: data.low ?? 0,
      open: data.open ?? 0,
      pcnt: data.pcnt ?? 0,
      sec: data.sec && data.sec !== "" ? data.sec : "N/A",
      stckname: data.stckname ?? "Unknown",
      vol: data.vol ?? 0
    };
  }
  return null;
};

// Function to create a listener for stock data
export const createStockDataListener_Nifty = (
  // userId: string,
  onData: (data: DataStockModel | null) => void,
  onError: (error: Error) => void
) => {
  const stockDataRef: DatabaseReference = ref(db2, `testbal/123/`);

  const unsubscribe = onValue(stockDataRef, 
    (snapshot) => {
      const parsedData = parseStockData(snapshot);
      onData(parsedData);
    },
    (error) => {
      console.error('Database error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};


// Function to create a listener for stock data
export const createStockDataListener_BankNifty = (
  // userId: string,
  onData: (data: DataStockModel | null) => void,
  onError: (error: Error) => void
) => {
  const stockDataRef: DatabaseReference = ref(db2, `testbal/123/`);

  const unsubscribe = onValue(stockDataRef, 
    (snapshot) => {
      const parsedData = parseStockData(snapshot);
      onData(parsedData);
    },
    (error) => {
      console.error('Database error:', error);
      onError(error);
    }
  );

  return unsubscribe;
};