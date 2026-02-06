import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AuthForm from "./AuthForm"; // Your vertical radial reveal form

export function AuthModal({ triggerText, triggerVariant = "default", triggerClassName = "" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>
      {/* Increased max-width to accommodate the 1050px auth card design */}
      <DialogContent className="max-w-[1050px] p-0 bg-transparent border-none shadow-none overflow-hidden">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}