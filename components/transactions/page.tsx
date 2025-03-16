"use client";

import { useEffect, useState } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { 
  FileDown, 
  FileText, 
  CreditCard, 
  ChevronDown,
  Download
} from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    { id: "a3f6b2c", amount: 432, status: "pending", email: "alex@example.com", name: "Alex Johnson" },
    { id: "b1d9e0f", amount: 275, status: "success", email: "jane.smith@example.com", name: "Jane Smith" },
    { id: "c2a8d5e", amount: 650, status: "failed", email: "mike@example.com", name: "Mike Brown" },
    { id: "d4f7h9j", amount: 300, status: "pending", email: "susan@example.com", name: "Susan Lee" },
    { id: "e5g1i3k", amount: 480, status: "success", email: "emily.johnson@example.com", name: "Emily Johnson" },
    { id: "f6h2j4l", amount: 390, status: "processing", email: "robert@example.com", name: "Robert Martin" },
    { id: "g7i3k5m", amount: 525, status: "pending", email: "chris@example.com", name: "Chris Evans" },
    { id: "h8j4l6n", amount: 310, status: "success", email: "laura@example.com", name: "Laura Wilson" },
    { id: "i9k5m7o", amount: 220, status: "failed", email: "patrick@example.com", name: "Patrick O'Neil" },
    { id: "j0l6n8p", amount: 415, status: "pending", email: "olivia@example.com", name: "Olivia Davis" },
    { id: "k1m7o9q", amount: 330, status: "processing", email: "andrew@example.com", name: "Andrew Thompson" },
    { id: "l2n8p0r", amount: 510, status: "success", email: "samantha@example.com", name: "Samantha Carter" },
    { id: "m3o9q1s", amount: 605, status: "pending", email: "daniel@example.com", name: "Daniel Rodriguez" },
    { id: "n4p0r2t", amount: 275, status: "failed", email: "karen@example.com", name: "Karen Walker" },
    { id: "o5q1s3u", amount: 450, status: "processing", email: "george@example.com", name: "George Harris" },
    { id: "p6r2t4v", amount: 370, status: "success", email: "michael@example.com", name: "Michael Brown" },
    { id: "q7s3u5w", amount: 290, status: "pending", email: "rachel@example.com", name: "Rachel Green" },
    { id: "r8t4v6x", amount: 520, status: "success", email: "brian@example.com", name: "Brian Lee" },
    { id: "s9u5w7y", amount: 480, status: "failed", email: "nicole@example.com", name: "Nicole Adams" },
    { id: "t0v6x8z", amount: 540, status: "pending", email: "david@example.com", name: "David Kim" },
  ];
}

export default function TransactionsPage() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const exportToCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transactions Report", 10, 10);

    data.forEach((payment, index) => {
      const yPos = 20 + index * 10;
      if (yPos < 280) { // Avoid overflowing page
        doc.text(`${index + 1}. ${payment.name} - $${payment.amount} - ${payment.status}`, 10, yPos);
      }
    });

    doc.save("transactions.pdf");
  };

  // Calculate financial summary
  const totalTransactions = data.length;
  const successfulTransactions = data.filter(p => p.status === "success").length;
  const pendingTransactions = data.filter(p => p.status === "pending").length;
  const failedTransactions = data.filter(p => p.status === "failed").length;
  
  const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
  const successAmount = data
    .filter(p => p.status === "success")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="w-full p-6">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track payment transactions
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={exportToCSV}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={exportToPDF}
              className="cursor-pointer"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export to PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalAmount)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <p className="text-green-700 font-bold">$</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-green-600">{successfulTransactions}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Amount</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(successAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pending/Failed</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-yellow-600">{pendingTransactions}</p>
                  <span className="text-xs text-muted-foreground">/</span>
                  <p className="text-lg font-bold text-red-600">{failedTransactions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}