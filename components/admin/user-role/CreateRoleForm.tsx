"use client";

import { createRole } from "@/actions/admin/role-actions";
import InputField from "@/components/form/InputField";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ALL_PERMISSION_VALUES, PERMISSION_GROUPS, PERMISSIONS } from "@/config/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(4, "Role name must be at least 4 characters long!")
    .regex(/[a-zA-Z]/, "Role name must contain at least one letter"),
  permissions: z.array(z.string()).min(1, "At least one permission is required!"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateRoleForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", permissions: [] },
  });

  const selectedPermissions = useWatch({ control: form.control, name: "permissions" });

  const isAllSelected = ALL_PERMISSION_VALUES.every((v) => selectedPermissions?.includes(v));

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
    let updated: string[];

    if (checked) {
      // Add parent + all children
      updated = [...new Set([...current, parentValue, ...childValues])];
    } else {
      // Remove parent + all children
      updated = current.filter((v) => v !== parentValue && !childValues.includes(v));
    }
    form.setValue("permissions", updated, { shouldValidate: true });
  };

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const t = Toast.loading({ title: "Status", description: "Creating the role..." });
    try {
      const payload = {
        ...data,
        permissions: isAllSelected ? [PERMISSIONS.ALL] : data.permissions,
      };

      const res = await createRole(payload);

      console.log(res);

      if ((res as any).error && (res as any).statusCode !== 200) {
        Toast.remove(t);
        Toast.error({ title: "Failed", description: (res as any)?.error || "Failed to create role!" });
      } else {
        form.reset();
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Role created successfully!" });
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to create role!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Role Setup</CardTitle>
          </CardHeader>

          <CardContent className="mt-4 space-y-6">
            {/* Role name */}
            <InputField name="name" label="Role Name" placeholder="Enter role name" type="text" required className="max-w-[400px]" />

            {/* Module Permissions */}
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
              <div className="space-y-5">
                {PERMISSION_GROUPS.map((group) => {
                  const childValues = group.items.map((i) => i.value);
                  const hasParent = "parent" in group && group.parent;

                  const isGroupAllSelected = hasParent
                    ? selectedPermissions?.includes(group.parent!.value) && childValues.every((v) => selectedPermissions?.includes(v))
                    : false;

                  return (
                    <div key={group.group} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">{group.group}</p>

                        {hasParent && (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={group.parent!.key}
                              checked={isGroupAllSelected}
                              onCheckedChange={(checked) => toggleGroupParent(group.parent!.value, childValues, !!checked)}
                            />
                            <Label htmlFor={group.parent!.key} className="cursor-pointer text-xs text-gray-500">
                              Full Access
                            </Label>
                          </div>
                        )}
                      </div>

                      {(!hasParent || group.group !== "Product Management") && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          {group.items.map((item) => (
                            <div key={item.key} className="flex items-center gap-2.5">
                              <Checkbox
                                id={item.key}
                                checked={selectedPermissions?.includes(item.value)}
                                onCheckedChange={(checked) => togglePermission(item.value, !!checked)}
                              />
                              <Label htmlFor={item.key} className="cursor-pointer text-sm font-medium text-gray-700">
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

              {/* Validation error */}
              {form.formState.errors.permissions && <p className="text-sm text-red-500">{form.formState.errors.permissions.message}</p>}
            </div>
          </CardContent>

          <CardFooter>
            <div className="ml-auto flex gap-3">
              <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateRoleForm;
