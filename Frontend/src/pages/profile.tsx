import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { InfoRow } from "@/components/ui/info-row";
import { User as UserIcon, Mail, Loader2, ArrowLeft } from "lucide-react";
import { useProfileForm } from "@/features/user/hooks/useProfileForm";
import { useAuth } from "@/features/auth/context/AuthContext";
import userService from "@/features/user/services/user.service";

export function Profile() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        profile,
        form,
        isEditing,
        isSaving,
        setIsEditing,
        handleChange,
        handleSave,
        handleCancel,
    } = useProfileForm();

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            await userService.deleteAccount();
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("Error deleting account. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!profile) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <div className="mb-4">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>

            <Card>
                <CardHeader className="items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border bg-muted overflow-hidden">
                        {profile.pictureUrl ? (
                            <img
                                src={profile.pictureUrl}
                                alt="Profile Avatar"
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <UserIcon size={40} className="text-muted-foreground" />
                        )}
                    </div>

                    <CardTitle className="text-2xl">
                        {profile.firstName} {profile.lastName}
                    </CardTitle>

                    <p className="text-muted-foreground">{profile.email}</p>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-5 py-6">
                    <InfoRow label="First Name" value={profile.firstName} isEditing={isEditing}>
                        <Input id="firstName" value={form.firstName} onChange={handleChange} className="max-w-[240px]" maxLength={50} />
                    </InfoRow>

                    <InfoRow label="Last Name" value={profile.lastName ?? "-"} isEditing={isEditing}>
                        <Input id="lastName" value={form.lastName} onChange={handleChange} className="max-w-[240px]" maxLength={150} />
                    </InfoRow>

                    <InfoRow label="Username" value={profile.userName} isEditing={isEditing}>
                        <Input id="userName" value={form.userName} onChange={handleChange} className="max-w-[240px]" maxLength={150} />
                    </InfoRow>

                    <InfoRow label="Email" value={profile.email} icon={<Mail className="h-4 w-4" />} />
                    <InfoRow label="Provider" value={profile.provider} />

                    <Separator />

                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDeleteAccount} 
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                                        </>
                                    ) : (
                                        "Delete Account"
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}