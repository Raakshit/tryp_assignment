"use client";
import { TableInfo, useDatas } from "@/Store/tableData";
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
import ReactPaginate from "react-paginate";

interface DataTableProps {
  headers: string[];
  caption: string;
}

const DataTables: React.FC<DataTableProps> = ({ headers, caption }) => {
  const { info, handleLoad } = useDatas();
  const [filterState, setFilterState] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterData, setFilterData] = useState<TableInfo[]>([]);
  const perPage = 8;
  const [sortedColumn, setSortedColumn] = useState<keyof TableInfo | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    handleLoad();
    setLoading(false);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [info, filterState]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState(e.target.value);
  };

  const handleSortColumn = (column: keyof TableInfo) => {
    const isStringColumn = typeof info[0][column] === "string";

    // filtering Logic working Fine
    // on clicking the header
    if(isStringColumn){
      const sortedData = [...filterData].sort((a,b)=>{
        const valueA = a[column] as string;
        const valueB = b[column] as string;
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
      setFilterData(sortedData);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      setCurrentPage(0);
    }
  };

  const applyFilter = () => {
    let filteredData = info;

    if (filterState === "success") {
      filteredData = info.filter((item) => item.Status.Success);
    } else if (filterState === "failed") {
      filteredData = info.filter((item) => item.Status.Failed);
    } else if (filterState === "waiting") {
      filteredData = info.filter((item) => item.Status.Waiting);
    }

    setFilterData(filteredData);
  };

  // console.log(sortedData);

  const pageCount = Math.ceil(filterData.length / perPage);
  const offset = currentPage * perPage;
  const currentItem = filterData.slice(offset, offset + perPage);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

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
              <Th
                onClick={() => handleSortColumn(header as keyof TableInfo)}
                cursor="pointer"
                key={header}
              >
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td>Loading Data</Td>
            </Tr>
          ) : (
            <>
              {currentItem.map((item) => (
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
      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
      />
    </Box>
  );
};

export default DataTables;
