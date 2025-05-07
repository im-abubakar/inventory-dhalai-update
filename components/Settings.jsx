"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Settings = () => {
  const { data: session } = useSession();

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  // Handle password change submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== retypePassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success(data.message);
        setNewPassword("");
        setRetypePassword("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={session?.user?.role || ""}
                readOnly
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || ""}
                readOnly
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Retype Password */}
            <div className="space-y-2">
              <Label htmlFor="retypePassword">Retype Password</Label>
              <Input
                id="retypePassword"
                type="password"
                placeholder="Retype new password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
