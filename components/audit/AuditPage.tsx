"use client";

import * as React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AuditTable from "./AuditTable";
import {
  StaffActivityLog,
  StaffActivityLogsResult,
} from "@/types/staff-activity-log";
import { getStaffActivityLogs } from "@/services/staff";
import { useUser } from "@/contexts/UserContext";

interface AuditPageProps {
  initialData: StaffActivityLogsResult;
}

const DEFAULT_PAGE_SIZE = 10;

export default function AuditPage({ initialData }: AuditPageProps) {
  const { user } = useUser();
  const initialStaffMap = React.useMemo(() => {
    const record: Record<string, string> = {};
    for (const log of initialData.logs) {
      if (log.staffId) {
        record[log.staffId] = log.staffName || "Unknown";
      }
    }
    return record;
  }, [initialData.logs]);

  const [logs, setLogs] = React.useState<StaffActivityLog[]>(initialData.logs);
  const [total, setTotal] = React.useState<number>(initialData.total);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");
  const [selectedStaff, setSelectedStaff] = React.useState<string>("all");
  const [page, setPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [staffDirectory, setStaffDirectory] =
    React.useState<Record<string, string>>(initialStaffMap);
  const [refreshIndex, setRefreshIndex] = React.useState<number>(0);
  React.useEffect(() => {
    setStaffDirectory(initialStaffMap);
  }, [initialStaffMap]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  React.useEffect(() => {
    let isCancelled = false;

    const fetchLogs = async () => {
      if (!user?.Jwt) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getStaffActivityLogs(
          {
            staffId: selectedStaff !== "all" ? selectedStaff : undefined,
            searchDescription: debouncedSearch || undefined,
            limit: pageSize,
            offset: page * pageSize,
          },
          user.Jwt
        );

        if (isCancelled) {
          return;
        }

        setLogs(result.logs);
        setTotal(result.total);
        setStaffDirectory((prev) => {
          const next = { ...prev };
          for (const log of result.logs) {
            if (log.staffId) {
              next[log.staffId] = log.staffName || "Unknown";
            }
          }
          return next;
        });
      } catch (fetchError) {
        if (isCancelled) {
          return;
        }

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load staff activity logs";
        setError(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchLogs();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, selectedStaff, page, pageSize, refreshIndex, user?.Jwt]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStaffChange = (value: string) => {
    setSelectedStaff(value);
    setPage(0);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0) {
      return;
    }

    const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

    if (totalPages && nextPage >= totalPages) {
      return;
    }

    setPage(nextPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  const staffOptions = React.useMemo(() => {
    return Object.entries(staffDirectory)
      .filter(([id]) => id)
      .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB));
  }, [staffDirectory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Review activity performed by staff members across the platform.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="self-start md:self-auto"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <Search className="h-4 w-4" /> Search description
            </label>
            <Input
              placeholder="Search by activity description"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter by staff
            </label>
            <Select value={selectedStaff} onValueChange={handleStaffChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All staff" />
              </SelectTrigger>
              <SelectContent className="border">
                <SelectItem value="all">All staff</SelectItem>
                {staffOptions.map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      <AuditTable
        logs={logs}
        isLoading={isLoading}
        total={total}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
