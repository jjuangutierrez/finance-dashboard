import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { User as UserIcon, Mail, Loader2, ArrowLeft } from "lucide-react";

import userService from "@/features/user/services/user.service";
import type { User } from "../features/user/models/User";

export function Profile() {
    const navigate = useNavigate(); 
    
    const [profile, setProfile] = useState<User>();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        userName: "",
    });

    useEffect(() => {
        userService.getProfile().then((data) => {
            console.log("Datos del perfil recibidos del backend:", data);
            setProfile(data);
            setForm({
                firstName: data.firstName,
                lastName: data.lastName ?? "",
                userName: data.userName,
            });
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSave = async () => {
        if (!profile) return;
        setIsSaving(true);
        try {
            await userService.updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                userName: form.userName
            });

            const updatedProfile = {
                ...profile,
                firstName: form.firstName,
                lastName: form.lastName,
                userName: form.userName,
            };
            
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) return;
        setForm({
            firstName: profile.firstName,
            lastName: profile.lastName ?? "",
            userName: profile.userName,
        });
        setIsEditing(false);
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

                    <p className="text-muted-foreground">
                        {profile.email}
                    </p>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-5 py-6">
                    <Info 
                        label="First Name" 
                        value={profile.firstName} 
                        isEditing={isEditing}
                    >
                        <Input 
                            id="firstName" 
                            value={form.firstName} 
                            onChange={handleChange} 
                            className="max-w-[240px]"
                            maxLength={50}
                        />
                    </Info>

                    <Info 
                        label="Last Name" 
                        value={profile.lastName ?? "-"} 
                        isEditing={isEditing}
                    >
                        <Input 
                            id="lastName" 
                            value={form.lastName} 
                            onChange={handleChange} 
                            className="max-w-[240px]"
                            maxLength={150}
                        />
                    </Info>

                    <Info 
                        label="Username" 
                        value={profile.userName} 
                        isEditing={isEditing}
                    >
                        <Input 
                            id="userName" 
                            value={form.userName} 
                            onChange={handleChange} 
                            className="max-w-[240px]"
                            maxLength={150}
                        />
                    </Info>

                    <Info label="Email" value={profile.email} icon={<Mail className="h-4 w-4" />} />

                    <Info label="Provider" value={profile.provider} />

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
                            <Button onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface InfoProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    isEditing?: boolean;
    children?: React.ReactNode;
}

function Info({ label, value, icon, isEditing, children }: InfoProps) {
    return (
        <div className="flex items-center justify-between min-h-[44px]">
            <span className="font-medium text-muted-foreground text-sm">
                {label}
            </span>

            <div className="flex items-center gap-2">
                {isEditing && children ? (
                    children
                ) : (
                    <>
                        {icon}
                        <span className="text-sm">{value}</span>
                    </>
                )}
            </div>
        </div>
    );
}