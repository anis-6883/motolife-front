import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFormSheet } from "@/context/FormSheetContext";
import ChangePasswordForm from "./ChangePasswordForm";
import UpdateProfileForm from "./UpdateProfileForm";

export default function ProfileFormSheet({ isChangePassword }: { isChangePassword: boolean }) {
  const { isOpen, closeSheet } = useFormSheet();

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="sm:max-w-lg dark:bg-[#18181C] dark:text-white">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl dark:text-white">
            {isChangePassword ? "Change Password" : "Update Profile"}
          </SheetTitle>
          <SheetDescription>{isChangePassword ? "Change your password" : "Update your profile information"}</SheetDescription>

          {isChangePassword ? <ChangePasswordForm /> : <UpdateProfileForm />}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
