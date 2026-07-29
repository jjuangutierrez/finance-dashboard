import type { ReactNode } from "react";

export interface InfoRowProps {
    label: string;
    value: string;
    icon?: ReactNode;
    isEditing?: boolean;
    children?: ReactNode;
}

export function InfoRow({ label, value, icon, isEditing, children }: InfoRowProps) {
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