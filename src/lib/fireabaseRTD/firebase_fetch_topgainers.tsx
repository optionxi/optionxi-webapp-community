import { DataStockModel } from '@/datamodels/stock_model';
import { db } from '@/utils/firebaseConfig';
import { ref, get, query } from 'firebase/database';
import { checkUserAuthentication } from './default_authcheck';

export const fetchScreenerresult = async  (whichgainer: string, whichsegment: string): Promise<DataStockModel[]> => {
  try {
    checkUserAuthentication();   
    
    const dbRef = ref(db,`screenerresult/${whichgainer}${whichsegment}`);
    // const dbRef = ref(db,'balancelive');
    const orderedQuery = query(dbRef);
    // const orderedQuery = query(dbRef, orderByChild('sr_name'), limitToFirst(10));
    // console.log("Fetching data from app1: ", orderedQuery.toString()); // Added for debugging

    // const snapshot = (await get(dbRef));
    const snapshot = (await get(orderedQuery));

    if (snapshot.exists()) {
      // console.log('Data found',snapshot.val());
      // console.log('Data available in app1');
      const data = snapshot.val();
      // console.log(data);

      //Setting null values
      const dataArray: DataStockModel[] = Object.keys(data).map((key) => {
      const item = data[key];

      // Return only the relevant properties, ensuring that undefined or null fields are handled.
      return {
        close: item.close ?? 0,
        pclose:item.pclose??0,
        high: item.high ?? 0,
        low: item.low ?? 0,
        open: item.open ?? 0,
        pcnt: item.pcnt ?? 0,
        sec: item.sec !== "" ? item.sec ?? "N/A" : "N/A",
        stckname: item.stckname ?? "Unknown",
        vol: item.vol ?? 0
      };
    }

       // Convert the dictionary to an array of DataItemTable
      // const dataArray: DataItemTable[] = Object.keys(data).map((key) => ({
      //   id: key, // Or use data[key].id if `id` is already present in the data
      //   ...data[key], // Spread the rest of the properties from data[key]
      // })
  );

      // console.log("Converted array is ",dataArray);
      // Sort the array by pcnt in descending order
      if(whichgainer.toLowerCase().includes("gainers")){
        dataArray.sort((a, b) => b.pcnt - a.pcnt);
      }
      if(whichgainer.toLowerCase().includes("losers")){
        dataArray.sort((a, b) => a.pcnt - b.pcnt);
      }
      if(whichgainer.toLowerCase().includes("volume")){
        dataArray.sort((a, b) => b.vol - a.vol);
      }
      return dataArray;
    } else {
      console.log('No data available in app1');
      return [];
    }
  } catch (error) {
    console.error('Error fetching data in app1: ', error);
    return [];
  }
};
