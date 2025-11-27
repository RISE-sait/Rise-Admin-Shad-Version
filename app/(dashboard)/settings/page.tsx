"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/services/user";
import type { UserUpdateRequestDto } from "@/app/api/Api";
import { auth } from "@/configs/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { loginWithFirebaseToken } from "@/services/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import StaffProfilePictureUpload from "@/components/staff/StaffProfilePictureUpload";
import { getAllStaffs } from "@/services/staff";
import type { User } from "@/types/user";
import { useTheme } from "next-themes";
import ReactCountryFlag from "react-country-flag";
import StaffManagement from "@/components/settings/StaffManagement";
import { StaffRoleEnum } from "@/types/user";
import WebsiteContentPage from "@/components/website-content/WebsiteContentPage";
type CountryOption = { code: string; name: string };

const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useUser();
  const [loggedInStaff, setLoggedInStaff] = useState<User | null>(null);
  const { toast } = useToast();

  const initialName = user?.Name ? user.Name.split(" ") : [];
  const initialPhoneDigits = (user?.Phone ?? "").replace(/\D/g, "");
  const initialCode =
    initialPhoneDigits.length > 10
      ? `+${initialPhoneDigits.slice(0, initialPhoneDigits.length - 10)}`
      : "+1";
  const initialNumber = initialPhoneDigits
    ? `(${initialPhoneDigits.slice(-10, -7)}) ${initialPhoneDigits.slice(
        -7,
        -4
      )}-${initialPhoneDigits.slice(-4)}`
    : "";

  const [firstName, setFirstName] = useState(initialName[0] ?? "");
  const [countriesList, setCountriesList] = useState<CountryOption[]>([]);
  const [lastName, setLastName] = useState(
    initialName.slice(1).join(" ") ?? ""
  );
  const [dob, setDob] = useState({ day: "01", month: "01", year: "1990" });
  const [country, setCountry] = useState("US");
  const [phoneCode, setPhoneCode] = useState(initialCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [email, setEmail] = useState(user?.Email ?? "");

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=cca2,name")
      .then((res) => res.json())
      .then((data) => {
        const countries = data
          .map((c: any) => ({ code: c.cca2, name: c.name.common }))
          .sort((a: CountryOption, b: CountryOption) =>
            a.name.localeCompare(b.name)
          );
        setCountriesList(countries);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user?.ID) {
      setLoggedInStaff(null);
      return;
    }

    let isMounted = true;

    const loadStaffProfile = async () => {
      try {
        const staffs = await getAllStaffs();
        if (!isMounted) return;
        const staffRecord = staffs.find((staff) => staff.ID === user.ID);
        if (staffRecord) {
          setLoggedInStaff(staffRecord);
        } else {
          setLoggedInStaff(null);
        }
      } catch (error) {
        console.error("Failed to load staff profile", error);
      }
    };

    loadStaffProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.ID]);

  useEffect(() => {
    if (!user) return;
    const nameParts = user.Name ? user.Name.split(" ") : [];
    setFirstName(nameParts[0] ?? "");
    setLastName(nameParts.slice(1).join(" ") ?? "");
    const digits = (user.Phone ?? "").replace(/\D/g, "");
    const code =
      digits.length > 10 ? `+${digits.slice(0, digits.length - 10)}` : "+1";
    const number = digits
      ? `(${digits.slice(-10, -7)}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`
      : "";
    setPhoneCode(code);
    setPhoneNumber(number);
    setEmail(user.Email ?? "");
    const rawDob =
      (user as any)?.Dob || (user as any)?.dob || (user as any)?.age;
    if (rawDob) {
      const [year, month, day] = rawDob.split("-");
      setDob({ day, month, year });
    }
    const userCountry =
      (user as any)?.CountryAlpha2Code ||
      (user as any)?.country_alpha2_code ||
      (user as any)?.country_code;
    if (userCountry) {
      setCountry(userCountry);
    }
  }, [user]);

  const getCountryName = (code: string) =>
    countriesList.find((c) => c.code === code)?.name ?? code;

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editDob, setEditDob] = useState({ day: "", month: "", year: "" });
  const [editCountry, setEditCountry] = useState("");
  const [editPhoneCode, setEditPhoneCode] = useState("+1");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [tempTheme, setTempTheme] = useState<string | undefined>(theme);

  const handleEditProfile = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditDob({ ...dob });
    setEditCountry(country);
    setEditPhoneCode(phoneCode);
    setEditPhoneNumber(phoneNumber);
    setEditEmail(email);
    setProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const paddedDay = editDob.day.padStart(2, "0");
    const paddedMonth = editDob.month.padStart(2, "0");
    const dobString = `${editDob.year}-${paddedMonth}-${paddedDay}`;

    const rawPhone = `${editPhoneCode}${editPhoneNumber}`;
    const phoneDigits = rawPhone.replace(/\D/g, "");

    const updateData: UserUpdateRequestDto = {
      first_name: editFirstName,
      last_name: editLastName,
      dob: dobString,
      country_alpha2_code: editCountry,
      has_marketing_email_consent: false,
      has_sms_consent: false,
      email: editEmail,
      ...(phoneDigits ? { phone: rawPhone } : {}),
    };

    const error = await updateUser(user.ID, updateData, user.Jwt);

    if (error) {
      toast({
        title: "Profile update failed",
        description: error,
        status: "error",
      });
      return;
    }

    setFirstName(editFirstName);
    setLastName(editLastName);
    setDob({ day: paddedDay, month: paddedMonth, year: editDob.year });
    setCountry(editCountry);
    if (phoneDigits) {
      setPhoneCode(editPhoneCode);
      setPhoneNumber(editPhoneNumber);
    }
    setEmail(editEmail);
    const normalizedPhone = phoneDigits
      ? phoneDigits.startsWith("1")
        ? `+${phoneDigits}`
        : `+1${phoneDigits}`
      : user.Phone;
    setUser({
      ...user,
      Name: `${editFirstName} ${editLastName}`.trim(),
      Email: editEmail,
      Phone: normalizedPhone,
      Dob: dobString,
      CountryAlpha2Code: editCountry,
    });
    setLoggedInStaff((prev) =>
      prev
        ? {
            ...prev,
            Name: `${editFirstName} ${editLastName}`.trim(),
            Email: editEmail,
            Phone: phoneDigits ? normalizedPhone : prev.Phone,
          }
        : prev
    );
    toast({ title: "Profile updated", status: "success" });
    setProfileOpen(false);
  };

  const handleEditAppearance = () => {
    setTempTheme(theme);
    setAppearanceOpen(true);
  };

  const handleSaveAppearance = () => {
    if (tempTheme) {
      setTheme(tempTheme);
    }
    setAppearanceOpen(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "All password fields are required",
        status: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", status: "error" });
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      toast({ title: "No authenticated user", status: "error" });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      const idToken = await currentUser.getIdToken(true);
      const backendUser = await loginWithFirebaseToken(idToken);
      localStorage.setItem("jwt", backendUser.Jwt);
      setUser(backendUser);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOpen(false);
      toast({ title: "Password updated", status: "success" });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Password update failed",
        description: error?.message || String(error),
        status: "error",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full ${user?.Role === StaffRoleEnum.SUPERADMIN ? 'grid-cols-6' : 'grid-cols-4'}`}>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          {user?.Role === StaffRoleEnum.SUPERADMIN && (
            <>
              <TabsTrigger value="website">Website Content</TabsTrigger>
              <TabsTrigger value="staff">Staff Management</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1">
              <Label className="text-sm text-muted-foreground">
                First name
              </Label>
              <div className="rounded-md border px-3 py-2 text-sm font-medium">
                {firstName}
              </div>
            </div>
            <div className="grid gap-1">
              <Label className="text-sm text-muted-foreground">Last name</Label>
              <div className="rounded-md border px-3 py-2 text-sm font-medium">
                {lastName}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-sm text-muted-foreground">
              Date of birth
            </Label>
            <div className="rounded-md border px-3 py-2 text-sm font-medium">
              {dob.day}/{dob.month}/{dob.year}
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-sm text-muted-foreground">
              Country of birth
            </Label>
            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium">
              <span>{getCountryName(country)}</span>
              {country && (
                <ReactCountryFlag
                  countryCode={country}
                  svg
                  className="text-lg"
                />
              )}
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-sm text-muted-foreground">Phone</Label>
            <div className="rounded-md border px-3 py-2 text-sm font-medium">
              {phoneCode} {phoneNumber}
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <div className="rounded-md border px-3 py-2 text-sm font-medium">
              {email}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </CardFooter>
      </Card>
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {loggedInStaff && (
              <div className="flex justify-center md:justify-start">
                <StaffProfilePictureUpload
                  staffData={loggedInStaff}
                  currentPhotoUrl={loggedInStaff.PhotoUrl}
                  isOwnProfile
                  isAdmin={false}
                  onPhotoUpdate={(photoUrl) =>
                    setLoggedInStaff((prev) =>
                      prev ? { ...prev, PhotoUrl: photoUrl } : prev
                    )
                  }
                />
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-first-name">First name</Label>
                <Input
                  id="edit-first-name"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-last-name">Last name</Label>
                <Input
                  id="edit-last-name"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date of birth</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="DD"
                  className="w-16"
                  maxLength={2}
                  value={editDob.day}
                  onChange={(e) =>
                    setEditDob({ ...editDob, day: e.target.value })
                  }
                />
                <Input
                  placeholder="MM"
                  className="w-16"
                  maxLength={2}
                  value={editDob.month}
                  onChange={(e) =>
                    setEditDob({ ...editDob, month: e.target.value })
                  }
                />
                <Input
                  placeholder="YYYY"
                  className="w-24"
                  maxLength={4}
                  value={editDob.year}
                  onChange={(e) =>
                    setEditDob({ ...editDob, year: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Country of birth</Label>
              <div className="flex items-center gap-2">
                <Select value={editCountry} onValueChange={setEditCountry}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesList.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={c.code}
                            svg
                            className="text-lg"
                          />
                          <span>{c.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex h-6 w-10 items-center justify-center rounded border bg-muted">
                  {editCountry && (
                    <ReactCountryFlag
                      countryCode={editCountry}
                      svg
                      className="text-lg"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <div className="flex gap-2">
                <Input
                  className="w-20"
                  value={editPhoneCode}
                  onChange={(e) => setEditPhoneCode(e.target.value)}
                />
                <Input
                  className="flex-1"
                  type="tel"
                  placeholder="(555) 555-1234"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editEmail} disabled />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSaveProfile}>Save</Button>
            <Button variant="ghost" onClick={() => setProfileOpen(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and security options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="grid gap-1">
              <Label className="text-sm text-muted-foreground">Password</Label>
              <div className="rounded-md border px-3 py-2 text-sm font-medium text-gray-600">
                ********
              </div>
            </div>
            <Button variant="outline" onClick={() => setPasswordOpen(true)}>
              Change password
            </Button>
          </div>

          <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdatePassword}>Update Password</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPasswordOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how Rise looks to you.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="grid gap-1">
            <Label className="text-sm text-muted-foreground">Theme</Label>
            <div className="rounded-md border px-3 py-2 text-sm font-medium capitalize">
              {theme}
            </div>
          </div>
          <Button variant="outline" onClick={handleEditAppearance}>
            Edit Appearance
          </Button>
        </CardContent>
      </Card>
      <Sheet open={appearanceOpen} onOpenChange={setAppearanceOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Appearance</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <RadioGroup
              value={tempTheme}
              onValueChange={setTempTheme}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="sheet-theme-light" />
                <Label htmlFor="sheet-theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="sheet-theme-dark" />
                <Label htmlFor="sheet-theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="sheet-theme-system" />
                <Label htmlFor="sheet-theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>
          <SheetFooter>
            <Button onClick={handleSaveAppearance}>Save</Button>
            <Button variant="ghost" onClick={() => setAppearanceOpen(false)}>
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
        </TabsContent>

        {/* Discounts Tab */}
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discounts</CardTitle>
              <CardDescription>
                Manage discount settings and pricing adjustments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discount settings will be configured here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Content Tab - Only for Super Admins */}
        {user?.Role === StaffRoleEnum.SUPERADMIN && (
          <TabsContent value="website" className="space-y-4">
            <WebsiteContentPage />
          </TabsContent>
        )}

        {/* Staff Management Tab - Only for Super Admins */}
        {user?.Role === StaffRoleEnum.SUPERADMIN && (
          <TabsContent value="staff" className="space-y-4">
            <StaffManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
