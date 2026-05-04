"use client";

import { updateRole } from "@/actions/admin/role-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ALL_PERMISSION_VALUES, PERMISSION_GROUPS, PERMISSIONS } from "@/config/constant";
import { useFormSheet } from "@/context/FormSheetContext";
import { Role } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Role name is required!"),
  permissions: z.array(z.string()).min(1, "At least one permission is required!"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RoleFormSheet({ role }: { role: Role | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeSheet } = useFormSheet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", permissions: [] },
  });

  const selectedPermissions = useWatch({ control: form.control, name: "permissions" });
  const isAllSelected = ALL_PERMISSION_VALUES.every((v) => selectedPermissions?.includes(v));

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        permissions: role.permissions?.[0] === PERMISSIONS.ALL ? [...ALL_PERMISSION_VALUES] : (role.permissions ?? []),
      });
    }
  }, [role]);

  const handleSelectAll = (checked: boolean) => {
    form.setValue("permissions", checked ? [...ALL_PERMISSION_VALUES] : [], { shouldValidate: true });
  };

  const togglePermission = (value: string, checked: boolean) => {
    const current = form.getValues("permissions") ?? [];
    const updated = checked ? [...current, value] : current.filter((v) => v !== value);
    form.setValue("permissions", updated, { shouldValidate: true });
  };

  const toggleGroupParent = (parentValue: string, childValues: string[], checked: boolean) => {
    const current = form.getValues("permissions") ?? [];
    const updated = checked
      ? [...new Set([...current, parentValue, ...childValues])]
      : current.filter((v) => v !== parentValue && !childValues.includes(v));
    form.setValue("permissions", updated, { shouldValidate: true });
  };

  const resetForm = () => closeSheet();

  const handleSubmit = async (data: FormValues) => {
    if (!role) return;
    setIsLoading(true);
    const t = Toast.loading({ title: "Status", description: "Updating the role..." });
    try {
      const payload = {
        ...data,
        permissions: isAllSelected ? [PERMISSIONS.ALL] : data.permissions,
      };

      const res = await updateRole(role._id, payload);

      if ((res as any).error || (res as any).statusCode !== 200) {
        Toast.remove(t);
        Toast.error({ title: "Failed", description: (res as any)?.error || "Failed to update role!" });
      } else {
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Role updated successfully!" });
        resetForm();
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to update role!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader className="scrollbar-none overflow-y-auto">
          <SheetTitle className="text-primary text-xl dark:text-white">Update Product Role</SheetTitle>
          <SheetDescription>Update the product role for better user experience</SheetDescription>

          <FormProvider {...form}>
            <div className="mt-4">
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="dark:border-white/10 dark:bg-[#151515] dark:text-white">
                  <CardHeader>
                    <CardTitle>Role Information</CardTitle>
                    <CardDescription>Basic information about the role</CardDescription>
                  </CardHeader>

                  <CardContent className="mt-4 space-y-6">
                    <InputField
                      name="name"
                      label="Role Name"
                      placeholder="Enter role name"
                      type="text"
                      required
                      className="max-w-[400px]"
                    />

                    <div className="space-y-5">
                      {/* Header + Select All */}
                      <div className="flex items-center gap-8">
                        <p className="font-semibold">Module Permission</p>
                        <div className="flex items-center gap-2.5">
                          <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={(checked) => handleSelectAll(!!checked)} />
                          <Label htmlFor="select-all" className="cursor-pointer font-medium">
                            Select All
                          </Label>
                        </div>
                      </div>

                      {/* Permission groups */}
                      <div className="space-y-4">
                        {PERMISSION_GROUPS.map((group) => {
                          const childValues = group.items.map((i) => i.value);
                          const hasParent = "parent" in group && group.parent;

                          const isGroupAllSelected = hasParent
                            ? selectedPermissions?.includes(group.parent!.value) &&
                              childValues.every((v) => selectedPermissions?.includes(v))
                            : false;

                          return (
                            <div
                              key={group.group}
                              className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5"
                            >
                              {/* Group header */}
                              <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{group.group}</p>

                                {hasParent && (
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={`update-${group.parent!.key}`}
                                      checked={isGroupAllSelected}
                                      onCheckedChange={(checked) => toggleGroupParent(group.parent!.value, childValues, !!checked)}
                                    />
                                    <Label
                                      htmlFor={`update-${group.parent!.key}`}
                                      className="cursor-pointer text-xs text-gray-500 dark:text-gray-400"
                                    >
                                      Full Access
                                    </Label>
                                  </div>
                                )}
                              </div>

                              {(!hasParent || group.group !== "Product Management") && (
                                <div className="grid grid-cols-2 gap-3">
                                  {group.items.map((item) => (
                                    <div key={item.key} className="flex items-center gap-2.5">
                                      <Checkbox
                                        id={`update-${item.key}`}
                                        checked={selectedPermissions?.includes(item.value)}
                                        onCheckedChange={(checked) => togglePermission(item.value, !!checked)}
                                      />
                                      <Label
                                        htmlFor={`update-${item.key}`}
                                        className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                                      >
                                        {item.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {form.formState.errors.permissions && (
                        <p className="text-sm text-red-500">{form.formState.errors.permissions.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-5 flex justify-between gap-4 md:justify-end">
                  <Button onClick={resetForm} type="button" variant="outline" disabled={isLoading} className="max-md:px-2">
                    Cancel
                  </Button>
                  <Button className="cool" type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Role"}
                  </Button>
                </div>
              </form>
            </div>
          </FormProvider>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
