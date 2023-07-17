"use client";
import { ReactNode, createContext, useContext, useState } from "react";

export type TableInfo = {
  Timestamp: string;
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

    setInfo(arr);
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
