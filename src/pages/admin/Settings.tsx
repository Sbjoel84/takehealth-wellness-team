import { useState, useEffect } from "react";
import { Save, User, Bell, Lock, Mail, Phone, MapPin, Camera, Eye, EyeOff, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authApi } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

const NOTIF_KEY = "takehealth_notification_prefs";
const PREF_KEY = "takehealth_display_prefs";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Settings() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [notifications, setNotifications] = useState(
    loadFromStorage(NOTIF_KEY, {
      emailAlerts: true,
      smsAlerts: false,
      appointmentReminders: true,
      clientUpdates: true,
      systemUpdates: true,
      marketingEmails: false,
    })
  );

  const [preferences, setPreferences] = useState(
    loadFromStorage(PREF_KEY, {
      language: "en",
      timezone: "Africa/Lagos",
    })
  );

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        const user = data.user ?? data;
        setProfile({
          firstName: user.firstName || user.fullName?.split(" ")[0] || "",
          lastName: user.lastName || user.fullName?.split(" ").slice(1).join(" ") || "",
          fullName: user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "",
        });
      } catch {
        // Fall back to locally stored user if profile endpoint fails
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const user = JSON.parse(stored);
            setProfile({
              firstName: user.firstName || user.fullName?.split(" ")[0] || "Admin",
              lastName: user.lastName || user.fullName?.split(" ").slice(1).join(" ") || "",
              fullName: user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
              email: user.email || "",
              phone: user.phone || "",
              role: user.role || "ADMIN",
            });
          }
        } catch { /* ignore */ }
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
    localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
    await new Promise((r) => setTimeout(r, 300));
    setIsSaving(false);
    toast({ title: "Preferences saved" });
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast({ title: "Please fill in all password fields", variant: "destructive" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "New passwords do not match", variant: "destructive" });
      return;
    }
    toast({
      title: "Password change unavailable",
      description: "A password update endpoint is not yet available on the backend.",
      variant: "destructive",
    });
  };

  const initials =
    profile.firstName && profile.lastName
      ? `${profile.firstName[0]}${profile.lastName[0]}`
      : profile.fullName
      ? profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)
      : "AU";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your profile and account preferences</p>
        </div>
        <Button onClick={handleSaveNotifications} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details from the backend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Profile editing requires a profile-update endpoint. Your details are shown read-only below.
                </AlertDescription>
              </Alert>

              {profileLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {initials.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm" className="gap-2" disabled>
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">Photo upload coming soon</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={profile.firstName} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={profile.lastName} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={profile.email} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={profile.phone || "—"} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profile.role} readOnly className="bg-muted/50" />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Change Password</h3>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Password changes will be available once the backend exposes a change-password endpoint.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Current Session</h3>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-sm text-muted-foreground">Active now</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Saved locally on this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Email Notifications</h3>
                {([
                  ["emailAlerts", "Email Alerts", "Receive important updates via email"],
                  ["appointmentReminders", "Appointment Reminders", "Get reminded about upcoming appointments"],
                  ["clientUpdates", "Client Updates", "Notifications about client activities"],
                  ["systemUpdates", "System Updates", "Updates about maintenance and new features"],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">SMS Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive urgent notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Marketing</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Promotional content and newsletters</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Saved locally on this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="w-full p-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="w-full p-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    >
                      <option value="Africa/Lagos">West Africa Time (WAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
