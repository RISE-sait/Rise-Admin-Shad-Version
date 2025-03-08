"use client";
import { Customer } from "../../types/customer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function CustomerTable({
  customers,
  onCustomerSelect,
}: {
  customers: Customer[];
  onCustomerSelect: (customer: Customer) => void;
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="overflow-auto h-[500px]">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-14"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Renewal Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow key="no-customers">
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No customers found
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow
                key={
                  customer.customer_id ||
                  `customer-${Math.random().toString(36).substr(2, 9)}`
                }
                onClick={() => onCustomerSelect(customer)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>
                  <Avatar>
                    <AvatarFallback>
                      {customer.name ? customer.name[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{customer.name || "N/A"}</TableCell>
                <TableCell>{customer.email || "N/A"}</TableCell>
                <TableCell>{customer.phone || "N/A"}</TableCell>
                <TableCell>{customer.membership || "None"}</TableCell>
                <TableCell>
                  {customer.membership_renewal_date
                    ? formatDate(customer.membership_renewal_date)
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
