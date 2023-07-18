"use client";
import { useDatas } from "@/Store/tableData";
import {
  Box,
  Select,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface DataTableProps {
  headers: string[];
  caption: string;
}

const DataTables: React.FC<DataTableProps> = ({ headers, caption }) => {
  const { info, handleLoad } = useDatas();
  const [filterState, setFilterState] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleLoad();
    setLoading(false);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState(e.target.value);
  };

  const filterData = info.filter((item) => {
    if (filterState === "success") {
      return item.Status.Success;
    } else if (filterState === "failed") {
      return item.Status.Failed;
    } else if (filterState === "waiting") {
      return item.Status.Waiting;
    }
    return true;
  })

  // topmost filtering should be of
  // this is always active/ topmost filtering feature in this

  return (
    <Box overflowX="auto">
      <Select value={filterState} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="success">Success</option>
        <option value="failed">Failed</option>
        <option value="waiting">Waiting</option>
      </Select>
      <Table variant="striped" colorScheme="blackAlpha">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td>Laoding Data</Td>
            </Tr>
          ) : (
            <>
              {filterData.map((item) => (
                <Tr key={item.PurchaseId}>
                  <Td>{item.Timestamp}</Td>
                  <Td>{item.PurchaseId}</Td>
                  <Td>{item.Mail}</Td>
                  <Td>{item.Name}</Td>
                  <Td>{item.Source}</Td>
                  <Td>
                    {item.Status.Success ? (
                      <span>Success</span>
                    ) : item.Status.Failed ? (
                      <span>Failed</span>
                    ) : (
                      <span>Waiting</span>
                    )}
                  </Td>
                  <Td>
                    <button>Select</button>
                  </Td>
                </Tr>
              ))}
            </>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataTables;
