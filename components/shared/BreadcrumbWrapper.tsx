import React from "react";

export default function BreadcrumbWrapper({
  children,
  addBtn,
  title,
  description,
}: {
  children: React.ReactNode;
  addBtn?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {addBtn}
      </div>

      {children}
    </div>
  );
}
