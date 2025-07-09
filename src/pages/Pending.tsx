import type { Order, OrderItem } from "@/types/type";
import { db } from "../../config/Firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Pending = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Order>();
  const { user } = useUser();
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    const getTransaction = async () => {
      if (!id) {
        toast.error("No transaction ID specified.");
        return;
      }
      setLoading(true);
      try {
        const docRef = doc(db, "transactions", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Order;
          setTransaction({ ...data, id: docSnap.id });
        } else {
          toast.error("Transaction not found.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch transaction.");
      } finally {
        setLoading(false);
      }
    };
    getTransaction();
  }, [id]);

  const acceptOrder = async () => {
    if (!id) {
      toast.error("Transaction ID is missing.");
      return;
    }
    setLoading(true);
    try {
      const docRef = doc(db, "transactions", id);
      await updateDoc(docRef, {
        AttendantName: user?.fullName,
        orderTime: serverTimestamp(),
        deliveryStatus: "completed",
      });
      toast.success("Order marked as completed.");
      navigate("/food");
    } catch (error) {
      toast.error("Failed to update transaction.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<OrderItem>[] = [
    {
      accessorKey: "imageUrl",
      header: "Food Image",
      cell: ({ row }) => (
        <img
          src={row.getValue("imageUrl")}
          alt="food"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Food Name",
      cell: ({ row }) => <div className="text-xs">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="text-xs">₦{row.getValue("price")}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue("quantity")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: transaction?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div
        className="flex items-center py-4 cursor-pointer hover:text-red-500"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft /> <p className="ml-1">Back</p>
      </div>

      <h1 className="capitalize font-bold text-xl mb-4">
        Transaction ID: {id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mb-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-semibold text-sm mb-2">User Info</h3>
          <p className="text-xs">Name: {transaction?.userName || " N/A"} </p>
          <p className="text-xs">Phone: {transaction?.phone}</p>
          <p className="text-xs">
            Address: {transaction?.address?.homeNumber},{" "}
            {transaction?.address?.streetName}, {transaction?.address?.townName}
            , {transaction?.address?.stateName}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm capitalize">
          <h3 className="font-semibold text-sm mb-2">Order Details</h3>
          <p className="text-xs">
            Payment Status: {transaction?.paymentStatus}
          </p>
          <p className="text-xs">
            Total Amount: ₦
            {transaction?.totalAmount ? transaction.totalAmount / 100 : 0}
          </p>
          <p className="text-xs">
            Processed Status: {transaction?.deliveryStatus}
          </p>
          <p className="text-xs">
            Order Date: {"   "}
            {transaction?.orderTime?.seconds &&
              new Date(
                transaction?.orderTime.seconds * 1000
              ).toLocaleDateString()}{" "}
            {"   "}
            {transaction?.orderTime?.seconds &&
              new Date(
                transaction?.orderTime.seconds * 1000
              ).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="rounded-md border w-[250px] md:w-full mx-auto">
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
            {loading ? (
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
                <TableRow key={row.id}>
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
                  className="text-center h-24"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={acceptOrder}
          disabled={loading}
          className={`text-white font-bold text-xl w-52 p-6 ${
            loading ? "bg-green-200" : "bg-green-500 hover:bg-green-400"
          }`}
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" /> Uploading...
            </>
          ) : (
            "Mark as Completed"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Pending;
