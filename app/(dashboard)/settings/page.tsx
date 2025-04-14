"use client"

// Component Imports
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import EditIcon from "@/public/Icons/Edit.svg"
import { useUser } from "@/contexts/UserContext";

// Themes
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import RoleProtected from "@/components/RoleProtected"

export default function Clients() {

  // get user
  const { user } = useUser();

  // Get Variables of External Components
  const { theme, setTheme } = useTheme()

  // Variables
  const [ email, setEmail ] = useState(user?.Email || "example@example.com")
  const [ password, setPassword ] = useState("pas*********")
  const [ newemail, setNewEmail ] = useState("")
  const [ verifyemail, setVerifyEmail ] = useState("")
  const [ newpassword, setNewPassword ] = useState("")
  const [ currentpasswordinput, setCurrentPasswordInput ] = useState("")
  const [ verifypassword, setVerifyPassword ] = useState("")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [alert, setAlert] = useState("")
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)


  const {toast} = useToast()

  // Set Email
  const ChangeEmail = () => {

    // Verify Email is Correct
    if (!emailRegex.test(newemail)) {
      setAlert("Please enter a valid email")
      return;
    }

    // Verify Emails Match
    if (newemail === verifyemail) {
        setEmail(newemail);
        // Send API Request to Change Emails
        // Reset States
        setAlert("")
        setNewEmail("")
        setVerifyEmail("")
        setIsEmailDialogOpen(false)
        return
    } else {
      setAlert("Emails do not match")
      return
    }

  }

  // Set Password
  const ChangePassword = () => {
    // Verify Password Isn't Null, Very if Matching then Submit Current Password, and NewPassword to API
    if (newpassword != "" && newpassword != null) {
      if (newpassword == verifypassword) {
        setPassword(newpassword)
        // API CALL HERE
        setAlert("")
        setNewPassword("")
        setVerifyPassword("")
        setCurrentPasswordInput("")
        setIsPasswordDialogOpen(false)
        return
      } else {
        setAlert("Passwords do not match")
      }
    } else {
      setAlert("Please Enter a Valid Password")
    }
  }

  // Clear Instances
  const ClearInstances = () => {
    // API call to clear instances
    toast({ status: "success", description: "Instances have been cleared" });
  }

  // Reset Alert on Dialogues Email
  useEffect(() => {
    if (!isEmailDialogOpen) {
      setAlert("")
      setNewEmail("")
      setVerifyEmail("")
    }
  }, [isEmailDialogOpen])

  // Reset Alert on Dialogue Password
  useEffect(() => {
    if (!isPasswordDialogOpen) {
      setAlert("")
      setNewPassword("")
      setVerifyPassword("")
      setCurrentPasswordInput("")
    }
  }, [isPasswordDialogOpen])

  return (
    <RoleProtected allowedRoles={["ADMIN", "SUPERADMIN"]} fallback={<h1 className="text-center text-2xl">Access Denied</h1>} >
    <div className="p-4 pt-1">
      {/* ACCOUNT SETTINGS */}
      <div>
        <h1 className="text-mg font-medium leading-none p-3">Account Settings</h1>
        <Separator/>
          {/* EMAIL */}
          <div className="p-5 pt-7" >
            <h1 className="text-mg pb-3">Email</h1>
            <h1 className="text-sm" > {email} </h1>
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen} >
              <DialogTrigger asChild className="mt-4" >
                <Button size={"icon"} variant="outline"> <Image src={EditIcon} alt="Icon"/> </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Email</DialogTitle>
                  <DialogDescription>
                    Ensure your new email is valid as its your primary source of logging in
                  </DialogDescription>
                  <div className="pt-3">
                    <div className="">
                      <Label htmlFor="email">
                        Email
                      </Label>
                      <Input className="mt-2" type="email" value={newemail} onChange={ (e) => setNewEmail(e.target.value) } />
                    </div>
                    <div className="pt-5">
                      <Label htmlFor="verifyemail">
                        Verify Email
                      </Label>
                      <Input className="mt-2" type="email" value={verifyemail} onChange={ (e) => setVerifyEmail(e.target.value) } />
                    </div>
                  </div>
                  <h1 className="text-center text-sm pt-3 text-red-500" > {alert} </h1>
                  <DialogFooter className="pt-3">
                    <Button type="button" onClick={ChangeEmail} >Save</Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          {/* PASSWORD */}
          <div className="p-5 pt-3" >
            <h1 className="text-mg pb-3">Password</h1>
            <h1 className="text-sm" > {password} </h1>
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} >
              <DialogTrigger asChild className="mt-4" >
                <Button size={"icon"} variant="outline"> <Image src={EditIcon} alt="Icon"/> </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Please ensure your password isn't too simple
                  </DialogDescription>
                  <div className="pt-3">
                    <div className="">
                      <Label htmlFor="password">
                        Current Password
                      </Label>
                      <Input className="mt-2" type="password" value={currentpasswordinput} onChange={ (e) => setCurrentPasswordInput(e.target.value) } />
                    </div>
                    <div className="pt-5">
                      <Label htmlFor="newpassword">
                        New Password
                      </Label>
                      <Input className="mt-2" type="password" value={newpassword} onChange={ (e) => setNewPassword(e.target.value) } />
                    </div>
                    <div className="pt-5">
                      <Label htmlFor="verifynewpassword">
                        Verify New Password
                      </Label>
                      <Input className="mt-2" type="password" value={verifypassword} onChange={ (e) => setVerifyPassword(e.target.value) } />
                    </div>
                  </div>
                  <h1 className="text-center text-sm pt-3 text-red-500" > {alert} </h1>
                  <DialogFooter className="pt-3">
                    <Button type="button" onClick={ChangePassword} >Save</Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
      </div>
      {/* SECURITY */}
      <div className="pt-5" >
        <h1 className="text-mg font-medium leading-none p-3">Account Security</h1>
        <Separator/>
          {/* LOGOUT OTHER INSTANCES */}
          <div className="p-5 pt-7" >
            <h1 className="text-mg pb-3">Clear login instances</h1>
            <h1 className="text-sm text-muted-foreground pb-3">Note - this unauthorizes all devices currently logged into this account</h1>
            <Button size={"default"} variant="outline" onClick={ClearInstances} > Clear Instances </Button>
          </div>
      </div>
      {/* CLIENT SETTINGS */}
      <div className="pt-5" >
        <h1 className="text-mg font-medium leading-none p-3">Client Settings</h1>
        <Separator/>
          {/* CLIENT THEME */}
          <div className="p-5 pt-7" >
            <h1 className="text-mg pb-3">Theme</h1>
              <Select value={theme} onValueChange={(value) => {setTheme(value)}} >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
          </div>
      </div>
    </div>
    </RoleProtected>
  )
}
