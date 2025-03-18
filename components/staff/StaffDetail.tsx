"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ApiService } from "@/app/api/ApiService"
import { StaffResponseDto } from "@/app/api/Api"
import { toast } from "@/components/staff/toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import StaffForm from "@/components/staff/StaffForm"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { AlertModal } from "@/components/ui/AlertModal"
import { Separator } from "@/components/ui/separator"

export default function StaffDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [staff, setStaff] = useState<StaffResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const isNew = params.id === "new"

  return <div>Not Implemented yet</div>

  // useEffect(() => {
  //   if (isNew) {
  //     setLoading(false)
  //     return
  //   }

  //   const fetchStaff = async () => {
  //     try {
  //       setLoading(true)
  //       console.log("Fetching staff with ID:", params.id);
  //       const response = await ApiService.staffs.staffsList({
  //         hubspot_ids: params.id as string
  //       })
  //       console.log("Staff response:", response);
  //       if (response.data && response.data.length > 0) {
  //         setStaff(response.data[0])
  //       } else {
  //         toast({
  //           variant: "destructive",
  //           title: "Not found",
  //           description: "Staff member not found."
  //         })
  //         router.push("/manage/staff")
  //       }
  //     } catch (error) {
  //       console.error('Error fetching staff:', error)
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "Failed to load staff member details."
  //       })
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchStaff()
  // }, [params.id, router, isNew])

  // const onDelete = async () => {
  //   try {
  //     setDeleting(true)
  //     await ApiService.staffs.staffsDelete(params.id as string)
  //     toast({
  //       title: "Success",
  //       description: "Staff member deleted successfully."
  //     })
  //     router.push("/manage/staff")
  //   } catch (error) {
  //     console.error('Error deleting staff:', error)
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Failed to delete staff member."
  //     })
  //   } finally {
  //     setDeleting(false)
  //     setOpen(false)
  //   }
  // }

  // return (
  //   <>
  //     <AlertModal
  //       isOpen={open}
  //       onClose={() => setOpen(false)}
  //       onConfirm={onDelete}
  //       loading={deleting}
  //     />
  //     <Sheet open={true} onOpenChange={() => router.push("/manage/staff")}>
  //       <SheetContent className="w-full max-w-md sm:max-w-xl overflow-y-auto">
  //         <SheetHeader className="pb-4">
  //           <SheetTitle>
  //             {isNew ? "Add New Staff Member" : `Edit ${staff?.first_name} ${staff?.last_name}`}
  //           </SheetTitle>
  //         </SheetHeader>
          
  //         {!isNew && staff && (
  //           <div className="flex justify-end mb-4">
  //             <Button 
  //               variant="destructive"
  //               size="sm"
  //               onClick={() => setOpen(true)}
  //               disabled={deleting}
  //             >
  //               <Trash className="h-4 w-4 mr-2" />
  //               Delete Staff
  //             </Button>
  //           </div>
  //         )}
          
  //         <Separator className="mb-6" />
          
  //         {loading ? (
  //           <div className="flex justify-center items-center min-h-[300px]">
  //             <p>Loading staff details...</p>
  //           </div>
  //         ) : isNew ? (
  //           <StaffForm onSubmit={async (data) => {
  //             try {
  //               setLoading(true);
  //               await ApiService.register.staffCreate(data);
  //               toast({
  //                 title: "Success",
  //                 description: "Staff member created successfully."
  //               });
  //               router.push("/manage/staff");
  //             } catch (error) {
  //               console.error('Error creating staff:', error);
  //               toast({
  //                 variant: "destructive",
  //                 title: "Error",
  //                 description: "Failed to create staff member."
  //               });
  //             } finally {
  //               setLoading(false);
  //             }
  //           }} loading={loading} />
  //         ) : staff ? (
  //           <StaffForm initialData={staff} /> 
  //         ) : null}
  //       </SheetContent>
  //     </Sheet>
  //   </>
  // )
}