/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUser } from "@clerk/clerk-react";
import type { Order } from "@/types/type";
import { db } from "../../config/Firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user } = useUser();
  const [transaction, setTransaction] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <div className="text-xs">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as {
          streetName?: string;
          stateName?: string;
          townName?: string;
          countryName?: string;
          homeNumber: string;
        };
        return (
          <div className="text-xs">
            {address.homeNumber},{address?.streetName}, {address?.townName},{" "}
            {address?.stateName}
          </div>
        );
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        const items = row.getValue("items");
        return <p className="text-xs px-4">{(items as any[]).length}</p>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount");
        return (
          <div className="font-semibold text-sm -px-6 ">
            ₦{(Number(amount) / 100).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "deliveryStatus",
      header: "Delivery",
      cell: ({ row }) => (
        <div className="capitalize text-xs">
          {row.getValue("deliveryStatus")}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: transaction,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getTransaction = async () => {
    setIsLoading(true);
    setTransaction([]);

    try {
      const q = query(
        collection(db, "transactions"),
        where("AttendantName", "==", user?.fullName),
        orderBy("orderTime", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);

      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }));
      setTransaction(transactions);
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTransaction();
  }, []);
  return (
    <div>
      <div className="h-[250px] flex items-center justify-center flex-col">
        <img
          src={user?.imageUrl}
          alt=""
          className="rounded-full object-cover mb-4"
          width={100}
          height={100}
          
        />
        <p className="capitalize ">{user?.fullName}</p>
        <p>{user?.primaryEmailAddress?.emailAddress}</p>
      </div>
      <div className="">
        <div className="flex justify-between items-center my-5">
          <h1 className="capitalize font-bold text-xl">last 20 transactions</h1>
        </div>
        <div className="">
          <div className="sm:flex items-center py-4 justify-between">
            <Input
              placeholder="Filter transactionId..."
              value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("id")?.setFilterValue(event.target.value)
              }
              className="max-w-sm focus-visible:border-2 focus-visible:border-green-400 focus-visible:ring-[0px] sm:mb-0 mb-4"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-60 sm:w-full mx-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-sm">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center h-24"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted cursor-pointer col-span-5 w-full"
                        onClick={() => navigate(`/complete/${row.original.id}`)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="sm:flex flex-col items-center justify-end space-x-2  py-4">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
