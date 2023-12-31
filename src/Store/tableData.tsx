"use client";
import { ReactNode, createContext, useContext, useState } from "react";

export type TableInfo = {
  Timestamp: number;
  PurchaseId: number;
  Mail: string;
  Name: string;
  Source: any;
  Status: {
    Failed: boolean;
    Success: boolean;
    Waiting: boolean;
  };
};

export type DataContext = {
  info: TableInfo[];
  handleLoad: () => void;
};

export const dataContext = createContext<DataContext | null>(null);

export const TableInfoProvider = ({ children }: { children: ReactNode }) => {
  const [info, setInfo] = useState<TableInfo[]>([]);

  const handleLoad = async () => {
    const res = await fetch("https://dummyjson.com/users");
    const fetchData = await res.json();
    const arr: TableInfo[] = [];
    fetchData.users.forEach((item: any) => {
      const newitem: TableInfo = {
        Timestamp: item.id,
        PurchaseId: item.phone,
        Mail: item.email,
        Name: item.firstName,
        Source: "",
        Status: {
          Failed: true,
          Success: false,
          Waiting: false,
        },
      };
      arr.push(newitem);
    });
    // Applying the topmost filtering feature that should always active or data initillty should be according to their timestamp
    const filteredData = arr.sort((a,b)=>a.Timestamp - b.Timestamp)
    // initally all the data is sorted only but when the real data came into play thne this would work/ or say you will able to see the function working 
    setInfo(filteredData);
  };

  return (
    <dataContext.Provider value={{ info, handleLoad }}>
      {children}
    </dataContext.Provider>
  );
};

export function useDatas() {
  const dataContextValue = useContext(dataContext);
  if (!dataContextValue) {
    throw new Error("UseTodos used outside of provider");
  }

  return dataContextValue;
}
