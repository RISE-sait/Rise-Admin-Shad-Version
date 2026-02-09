"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
  getAllApplications,
  updateApplicationStatus,
  updateApplicationNotes,
  updateApplicationRating,
} from "@/services/careers";
import type {
  Job,
  Application,
  CreateJobRequest,
  JobStatus,
  ApplicationStatus,
} from "@/types/careers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MapPin,
  Building2,
  Globe,
  XCircle,
  Archive,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { JobForm } from "@/components/careers/JobForm";
import { ApplicationDetailPanel } from "@/components/careers/ApplicationDetailPanel";
import { JobStatusBadge, ApplicationStatusBadge } from "@/components/careers/StatusBadge";
import { RatingStars } from "@/components/careers/RatingStars";

const ITEMS_PER_PAGE = 10;

export default function CareersManagement() {
  const { user } = useUser();
  const { toast } = useToast();

  // Tab state
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobSheetOpen, setJobSheetOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [savingJob, setSavingJob] = useState(false);
  const [deleteJobDialogOpen, setDeleteJobDialogOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [deletingJobLoading, setDeletingJobLoading] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsPage, setApplicationsPage] = useState(1);
  const [filterJobId, setFilterJobId] = useState<string>("all");
  const [applicationDetailOpen, setApplicationDetailOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Load jobs
  const loadJobs = useCallback(async () => {
    if (!user?.Jwt) return;
    setLoadingJobs(true);
    try {
      const data = await getAllJobs(user.Jwt);
      setJobs(data);
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load job postings",
        status: "error",
      });
    } finally {
      setLoadingJobs(false);
    }
  }, [user?.Jwt, toast]);

  // Load applications
  const loadApplications = useCallback(async () => {
    if (!user?.Jwt) return;
    setLoadingApplications(true);
    try {
      const data = await getAllApplications(user.Jwt);
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        status: "error",
      });
    } finally {
      setLoadingApplications(false);
    }
  }, [user?.Jwt, toast]);

  // Initial load
  useEffect(() => {
    loadJobs();
    loadApplications();
  }, [loadJobs, loadApplications]);

  // ==================== Jobs Handlers ====================

  const handleOpenCreateJob = () => {
    setEditingJob(null);
    setJobSheetOpen(true);
  };

  const handleOpenEditJob = (job: Job) => {
    setEditingJob(job);
    setJobSheetOpen(true);
  };

  const handleSaveJob = async (data: CreateJobRequest) => {
    if (!user?.Jwt) return;

    if (!data.title.trim() || !data.position.trim() || !data.description.trim()) {
      toast({
        title: "Error",
        description: "Title, position, and description are required",
        status: "error",
      });
      return;
    }

    setSavingJob(true);
    try {
      if (editingJob) {
        const { error } = await updateJob(editingJob.id, data, user.Jwt);
        if (error) {
          toast({ title: "Error", description: error, status: "error" });
        } else {
          toast({ title: "Success", description: "Job posting updated", status: "success" });
          setJobSheetOpen(false);
          setEditingJob(null);
          loadJobs();
        }
      } else {
        const { error } = await createJob(data, user.Jwt);
        if (error) {
          toast({ title: "Error", description: error, status: "error" });
        } else {
          toast({ title: "Success", description: "Job posting created", status: "success" });
          setJobSheetOpen(false);
          loadJobs();
        }
      }
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!user?.Jwt || !deletingJob) return;

    setDeletingJobLoading(true);
    try {
      const { success, error } = await deleteJob(deletingJob.id, user.Jwt);
      if (success) {
        toast({ title: "Success", description: "Job posting deleted", status: "success" });
        setDeleteJobDialogOpen(false);
        setDeletingJob(null);
        loadJobs();
      } else {
        toast({ title: "Error", description: error || "Failed to delete", status: "error" });
      }
    } finally {
      setDeletingJobLoading(false);
    }
  };

  const handleJobStatusChange = async (job: Job, newStatus: JobStatus) => {
    if (!user?.Jwt) return;

    const { error } = await updateJobStatus(job.id, newStatus, user.Jwt);
    if (error) {
      toast({ title: "Error", description: error, status: "error" });
    } else {
      toast({ title: "Success", description: "Job status updated", status: "success" });
      loadJobs();
    }
  };

  // ==================== Applications Handlers ====================

  const handleOpenApplicationDetail = (application: Application) => {
    setSelectedApplication(application);
    setApplicationDetailOpen(true);
  };

  const handleApplicationStatusChange = async (id: string, status: ApplicationStatus) => {
    if (!user?.Jwt) return;

    const { error } = await updateApplicationStatus(id, status, user.Jwt);
    if (error) {
      toast({ title: "Error", description: error, status: "error" });
    } else {
      toast({ title: "Success", description: "Application status updated", status: "success" });
      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => (prev ? { ...prev, status } : prev));
      }
    }
  };

  const handleApplicationNotesChange = async (id: string, notes: string) => {
    if (!user?.Jwt) return;

    const { error } = await updateApplicationNotes(id, notes, user.Jwt);
    if (error) {
      toast({ title: "Error", description: error, status: "error" });
    } else {
      toast({ title: "Success", description: "Notes saved", status: "success" });
      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, internal_notes: notes } : app))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) =>
          prev ? { ...prev, internal_notes: notes } : prev
        );
      }
    }
  };

  const handleApplicationRatingChange = async (id: string, rating: number) => {
    if (!user?.Jwt) return;

    const { error } = await updateApplicationRating(id, rating, user.Jwt);
    if (error) {
      toast({ title: "Error", description: error, status: "error" });
    } else {
      toast({ title: "Success", description: "Rating updated", status: "success" });
      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, rating } : app))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => (prev ? { ...prev, rating } : prev));
      }
    }
  };

  // ==================== Pagination ====================

  // Jobs pagination
  const totalJobsPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = jobs.slice(
    (jobsPage - 1) * ITEMS_PER_PAGE,
    jobsPage * ITEMS_PER_PAGE
  );

  // Applications pagination with filter
  const filteredApplications =
    filterJobId === "all"
      ? applications
      : applications.filter((app) => app.job_id === filterJobId);
  const totalApplicationsPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (applicationsPage - 1) * ITEMS_PER_PAGE,
    applicationsPage * ITEMS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setApplicationsPage(1);
  }, [filterJobId]);

  // ==================== Helpers ====================

  const formatEmploymentType = (type: string) => {
    // Handle underscore format from backend (e.g., full_time -> Full-time)
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  const formatLocationType = (type: string) => {
    // Handle underscore format from backend (e.g., on_site -> On-site)
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Careers Management
          </CardTitle>
          <CardDescription>
            Manage job postings and review applications for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "jobs" | "applications")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Job Postings
              </TabsTrigger>
              <TabsTrigger value="applications" className="gap-2">
                <Users className="h-4 w-4" />
                Applications
              </TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <div className="flex justify-end mb-4">
                <Button onClick={handleOpenCreateJob}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Posting
                </Button>
              </div>

              {loadingJobs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No job postings yet. Create your first one!</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.position}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {formatEmploymentType(job.employment_type)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              {job.location_type === "remote" ? (
                                <>
                                  <MapPin className="h-3 w-3" />
                                  Remote
                                </>
                              ) : (
                                <>
                                  <Building2 className="h-3 w-3" />
                                  {formatLocationType(job.location_type)}
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <JobStatusBadge status={job.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleOpenEditJob(job)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Details
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Change Status
                                  </DropdownMenuLabel>

                                  {job.status !== "draft" && (
                                    <DropdownMenuItem
                                      onClick={() => handleJobStatusChange(job, "draft")}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Move to Draft
                                    </DropdownMenuItem>
                                  )}
                                  {job.status !== "published" && (
                                    <DropdownMenuItem
                                      onClick={() => handleJobStatusChange(job, "published")}
                                      className="text-green-600 dark:text-green-400"
                                    >
                                      <Globe className="h-4 w-4 mr-2" />
                                      Publish
                                    </DropdownMenuItem>
                                  )}
                                  {job.status !== "closed" && (
                                    <DropdownMenuItem
                                      onClick={() => handleJobStatusChange(job, "closed")}
                                      className="text-amber-600 dark:text-amber-400"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Close
                                    </DropdownMenuItem>
                                  )}
                                  {job.status !== "archived" && (
                                    <DropdownMenuItem
                                      onClick={() => handleJobStatusChange(job, "archived")}
                                    >
                                      <Archive className="h-4 w-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDeletingJob(job);
                                      setDeleteJobDialogOpen(true);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Jobs Pagination */}
                  {totalJobsPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(jobsPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                        {Math.min(jobsPage * ITEMS_PER_PAGE, jobs.length)} of{" "}
                        {jobs.length} jobs
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                          disabled={jobsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {jobsPage} of {totalJobsPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJobsPage((p) => Math.min(totalJobsPages, p + 1))}
                          disabled={jobsPage === totalJobsPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter by job:</span>
                  <Select value={filterJobId} onValueChange={setFilterJobId}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="All jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All jobs</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loadingApplications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {filterJobId === "all"
                      ? "No applications yet."
                      : "No applications for this job."}
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.first_name} {application.last_name}
                          </TableCell>
                          <TableCell>{application.job_title || "N/A"}</TableCell>
                          <TableCell>
                            <ApplicationStatusBadge status={application.status} />
                          </TableCell>
                          <TableCell>
                            <RatingStars rating={application.rating || 0} size="sm" />
                          </TableCell>
                          <TableCell>
                            {application.created_at
                              ? format(new Date(application.created_at), "MMM d, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenApplicationDetail(application)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Applications Pagination */}
                  {totalApplicationsPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(applicationsPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                        {Math.min(
                          applicationsPage * ITEMS_PER_PAGE,
                          filteredApplications.length
                        )}{" "}
                        of {filteredApplications.length} applications
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setApplicationsPage((p) => Math.max(1, p - 1))
                          }
                          disabled={applicationsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {applicationsPage} of {totalApplicationsPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setApplicationsPage((p) =>
                              Math.min(totalApplicationsPages, p + 1)
                            )
                          }
                          disabled={applicationsPage === totalApplicationsPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Job Form Sheet */}
      <JobForm
        open={jobSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingJob(null);
          }
          setJobSheetOpen(open);
        }}
        job={editingJob}
        saving={savingJob}
        onSave={handleSaveJob}
      />

      {/* Application Detail Panel */}
      <ApplicationDetailPanel
        open={applicationDetailOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null);
          }
          setApplicationDetailOpen(open);
        }}
        application={selectedApplication}
        onStatusChange={handleApplicationStatusChange}
        onNotesChange={handleApplicationNotesChange}
        onRatingChange={handleApplicationRatingChange}
      />

      {/* Delete Job Confirmation Dialog */}
      <AlertDialog open={deleteJobDialogOpen} onOpenChange={setDeleteJobDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the job posting{" "}
              <strong>{deletingJob?.title}</strong>? This action cannot be undone.
              All associated applications will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingJobLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={deletingJobLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingJobLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
