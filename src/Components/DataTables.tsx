'use client'
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
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
// import "./DataTables.css"; // Import the CSS file for custom styling

interface DataTableProps {
  headers: string[];
  caption: string;
}

const DataTables: React.FC<DataTableProps> = ({ headers, caption }) => {
  const { info, handleLoad } = useDatas();
  const [filterState, setFilterState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [info, filterState, searchQuery]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState(e.target.value);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortColumn = (column: keyof TableInfo) => {
    const isStringColumn = typeof info[0][column] === "string";

    if (isStringColumn) {
      const sortedData = [...filterData].sort((a, b) => {
        const valueA = a[column] as string;
        const valueB = b[column] as string;
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
      setFilterData(sortedData);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilterData(filteredData);
  };

  const pageCount = Math.ceil(filterData.length / perPage);
  const offset = currentPage * perPage;
  const currentItem = filterData.slice(offset, offset + perPage);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <Box className="table_main" overflowX="auto">
      <Box className="table_header">
        <Select
          className="table_select"
          size="md"
          variant="filled"
          value={filterState}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="waiting">Waiting</option>
        </Select>
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </Box>
      <Table variant="simple" colorScheme="blackAlpha" size="sm">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th
                onClick={() => handleSortColumn(header as keyof TableInfo)}
                key={header}
                className="table_header"
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
                    <span
                      className={`status ${
                        item.Status.Success
                          ? "success"
                          : item.Status.Failed
                          ? "failed"
                          : "waiting"
                      }`}
                    >
                      {item.Status.Success
                        ? "Success"
                        : item.Status.Failed
                        ? "Failed"
                        : "Waiting"}
                    </span>
                  </Td>
                  <Td>
                    <button className="select_button">Select</button>
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
        pageClassName="pagination_item"
        previousClassName="pagination_item"
        nextClassName="pagination_item"
      />
    </Box>
  );
};

export default DataTables;
