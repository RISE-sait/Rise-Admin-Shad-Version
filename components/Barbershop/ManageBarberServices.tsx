"use client";

import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getAllStaffs } from "@/services/staff";
import { getBarberServices, deleteBarberService } from "@/services/barber";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FolderSearch } from "lucide-react";
import RightDrawer from "../reusable/RightDrawer";
import AddBarberServiceForm from "./AddBarberServiceForm";
import { HaircutServiceBarberServiceResponseDto } from "@/app/api/Api";
import { matchesSearchQuery } from "@/utils/inputValidation";

export default function ManageBarberServicesPage() {
  const [services, setServices] = useState<
    HaircutServiceBarberServiceResponseDto[]
  >([]);
  const [filteredServices, setFilteredServices] = useState<
    HaircutServiceBarberServiceResponseDto[]
  >([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<HaircutServiceBarberServiceResponseDto | null>(null);
  const [drawerContent, setDrawerContent] = useState<"details" | "add" | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useUser();

  // Fetch barbers and services
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch barbers
        const staffData = await getAllStaffs("BARBER");
        setBarbers(staffData);

        // Fetch barber services - no mapping needed as we're using the exact API model
        const servicesData = await getBarberServices();
        setServices(servicesData);
        setFilteredServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          status: "error",
          description: "Failed to load barber services",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter services when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = services.filter(
        (service) =>
          matchesSearchQuery(searchQuery, service.barber_name) ||
          matchesSearchQuery(searchQuery, service.haircut_name)
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const handleServiceSelect = (
    service: HaircutServiceBarberServiceResponseDto
  ) => {
    setSelectedService(service);
    setDrawerContent("details");
    setDrawerOpen(true);
  };

  const handleAddService = () => {
    setDrawerContent("add");
    setDrawerOpen(true);
  };

  const handleServiceAdded = async () => {
    setDrawerOpen(false);
    toast({ status: "info", description: "Refreshing services..." });

    try {
      const servicesData = await getBarberServices();
      setServices(servicesData);
      setFilteredServices(servicesData);
      toast({ status: "success", description: "Service added successfully" });
    } catch (error) {
      console.error("Error refreshing services:", error);
      toast({
        status: "warning",
        description: "Service added but list refresh failed",
      });
    }
  };

  // Handle service deletion
  const handleServiceDelete = async (serviceId: string) => {
    if (!serviceId) {
      toast({ status: "error", description: "Invalid service ID" });
      return;
    }

    if (!user?.Jwt) {
      toast({
        status: "error",
        description: "You must be logged in to remove services",
      });
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteBarberService(serviceId, user.Jwt);

      // Close drawer if it's open
      if (drawerOpen) {
        setDrawerOpen(false);
      }

      // Refresh the services list
      const updatedServices = await getBarberServices();
      setServices(updatedServices);
      setFilteredServices(updatedServices);

      toast({ status: "success", description: "Service removed successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({ status: "error", description: "Failed to remove service" });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Barber Services"
          description="Manage which barbers offer which services"
        />
        <Button onClick={handleAddService} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Barber Service
        </Button>
      </div>

      <Separator />

      <Button variant="outline" className="mb-4" asChild>
        <Link href="/manage/barbershop">← Back to Barbershop</Link>
      </Button>

      {/* Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by barber or service..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table - Updated to match API fields */}
      <div className="rounded-xl overflow-hidden border">
        <Table className="border-collapse">
          <TableHeader className="bg-muted/100 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                <div className="flex items-center space-x-2">Barber</div>
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                <div className="flex items-center space-x-2">Service</div>
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b">
                <div className="flex items-center space-x-2">
                  Service Type ID
                </div>
              </TableHead>
              <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  Loading services...
                </TableCell>
              </TableRow>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <TableRow
                  key={service.id}
                  className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {service.barber_name || "Unknown Barber"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {service.haircut_name || "Unknown Service"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {service.haircut_id || "N/A"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium text-right">
                    <div
                      className="flex justify-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border bg-popover text-popover-foreground"
                        >
                          <DropdownMenuLabel className="px-3 py-2">
                            Service Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="px-3 py-2 hover:bg-accent cursor-pointer"
                            onClick={() => handleServiceSelect(service)}
                          >
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                confirm(
                                  "Are you sure you want to remove this service?"
                                )
                              ) {
                                handleServiceDelete(service.id || "");
                              }
                            }}
                          >
                            <span>Remove Service</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                    <span>No barber services found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Drawer for details/add */}
      {drawerOpen && (
        <RightDrawer
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          drawerWidth="w-[500px]"
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {drawerContent === "details"
                ? "Service Details"
                : "Add Barber Service"}
            </h2>
            {drawerContent === "details" && selectedService && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Barber
                  </h3>
                  <p className="text-lg">{selectedService.barber_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Service
                  </h3>
                  <p className="text-lg">{selectedService.haircut_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Service Type ID
                  </h3>
                  <p className="text-lg">
                    {selectedService.haircut_id || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created At
                  </h3>
                  <p className="text-lg">
                    {selectedService.created_at || "N/A"}
                  </p>
                </div>
                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deleteLoading}
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to remove this service?")
                      ) {
                        handleServiceDelete(selectedService.id || "");
                      }
                    }}
                  >
                    {deleteLoading ? "Removing..." : "Remove Service"}
                  </Button>
                </div>
              </div>
            )}
            {drawerContent === "add" && (
              <AddBarberServiceForm
                onServiceAdded={handleServiceAdded}
                onCancel={() => setDrawerOpen(false)}
                barbers={barbers}
              />
            )}
          </div>
        </RightDrawer>
      )}
    </div>
  );
}
