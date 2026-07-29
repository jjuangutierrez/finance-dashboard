import { useEffect, useState } from "react";
import userService from "@/features/user/services/user.service";
import type { User } from "@/features/user/models/User";

export function useProfileForm() {
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
            setProfile(data);
            setForm({
                firstName: data.firstName,
                lastName: data.lastName ?? "",
                userName: data.userName,
            });
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSave = async () => {
        if (!profile) return;
        setIsSaving(true);
        try {
            await userService.updateProfile(form);
            setProfile((prev) => (prev ? { ...prev, ...form } : prev));
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

    return {
        profile,
        form,
        isEditing,
        isSaving,
        setIsEditing,
        handleChange,
        handleSave,
        handleCancel,
    };
}