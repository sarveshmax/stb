import React from "react";

type EmptyStateProps = {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  paddingVertical?: string;
};

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  paddingVertical = "py-25", //DEFAULT PADDING 25
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center
        ${paddingVertical}
        text-gray-300 tracking-widest`}
    >
      <Icon size={32} className="mb-3 text-gray-300/60" />

      <div className="text-[14px] text-center">{title}</div>

      {subtitle && <div className="text-[14px] text-center text-gray-300/50">{subtitle}</div>}
    </div>
  );
}
