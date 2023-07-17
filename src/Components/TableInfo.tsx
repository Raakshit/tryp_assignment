"use client";
import { useDatas } from "@/Store/tableData";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

const TableInfo = () => {

  const {info,handleLoad} = useDatas();
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    handleLoad();
    setLoading(false);
  },[])

  if(!loading){
    console.log(info)
  }

  return (
    <>
      {/* {
        loading ? (
          <>
            <h3>Data loading</h3>
          </>
        ):(
          <>
          <h3>Data Loaded properly</h3>
          {info.map((item)=>(
            <h2 key={item.PurchaseId}>{item.Mail}</h2>
          ))}
          </>
        )
      }
      <h2>Hello from frontend</h2> */}
      <TableContainer>
  <Table variant='striped' colorScheme='teal'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr>
        <Th>TIMESTAMP</Th>
        <Th>PRUCHASE ID</Th>
        <Th>MAIL</Th>
        <Th>NAME</Th>
        <Th>SOURCE</Th>
        <Th>STATUS</Th>
        <Th>SELECT</Th>
      </Tr>
    </Thead>
    <Tbody>
      {
        loading ? (
          <Tr>
            <Td>Laoding Data</Td>
          </Tr>
        ) : (
          <>
            {info.map((item) => (
              <Tr key={item.PurchaseId}>
                <Td>{item.Timestamp}</Td>
                <Td>{item.PurchaseId}</Td>
                <Td>{item.Mail}</Td>
                <Td>{item.Name}</Td>
                <Td>{item.Source}</Td>
                <Td>{item.Status.Success}</Td>
                <Td><button>Select</button></Td>
              </Tr>
            ))}
          </>
        )
      }
    </Tbody>
  </Table>
</TableContainer>
    </> 
  );
};

export default TableInfo;
