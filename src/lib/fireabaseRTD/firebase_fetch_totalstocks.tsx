import { DataStockModel } from "@/datamodels/stock_model";
import { db } from "@/utils/firebaseConfig";
import { get, query, ref } from "@firebase/database";
import { checkUserAuthentication } from "./default_authcheck";

export const fetchTotalStocks = async (): Promise<DataStockModel[]> => {
  try {
    checkUserAuthentication();   
    const dbRef = ref(db, `totalstocklist`);
    const orderedQuery = query(dbRef);
    // console.log("Fetching data from app1: ", orderedQuery.toString()); // Added for debugging

    const snapshot = await get(orderedQuery);

    if (snapshot.exists()) {
      // console.log('Data available in app1');
      const data = snapshot.val();
      // console.log(data);

      // Convert snapshot data to DataStockModel array
      const dataArray: DataStockModel[] = Object.keys(data).map((key) => {
        const item = data[key];

        return {
          close: item.c ?? 0,
          pclose:item.pclose??0,
          high: item.h ?? 0,
          low: item.l ?? 0,
          open: item.o ?? 0,
          pcnt: item.pcnt ?? 0,
          sec: item.sec !== "" ? item.sec ?? "N/A" : "N/A",
          stckname: key, // Correctly map stckname to the key
          vol: item.v ?? 0
        };
      });

      // Sort the array by pcnt in descending order
      dataArray.sort((a, b) => b.pcnt - a.pcnt);
      // dataArray.sort();

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