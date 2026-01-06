import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONES } from "@/lib/timezones";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

const NewWebsiteDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => Promise<void>;
}) => {
  const [domain, setDomain] = useState("");
  const [timezone, setTimezone] = useState("");
  const [enableLocalHostTracking, setEnableLocalHostTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log(domain, timezone, enableLocalHostTracking);
      setLoading(true);
      const result = await axios.post("/api/website", {
        websiteId: crypto.randomUUID(),
        domain,
        timezone,
        enableLocalTracking: enableLocalHostTracking,
      });

      // console.log(result.data);
      toast("Website added successfully!", {
        duration: 3000,
        position: "top-center",
        cancel:true
      });
      if (onSuccess) {
        await onSuccess();
      }
      
      setLoading(false);
      onOpenChange(false);
      

      setDomain("");
      setTimezone("");
      setEnableLocalHostTracking(false);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data || error.message || "Failed to add website";
      toast.error(errorMessage);
      setLoading(false);
    }
  } 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => onFormSubmit(e)}>
          <DialogHeader>
            <DialogTitle className="font-extrabold">
              Add Your Website
            </DialogTitle>
            <DialogDescription>
              Track visitor analytics, performance metrics, and engagement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Domain */}
            <div className="grid gap-2">
              <Label className="font-extrabold" htmlFor="domain">
                Domain
              </Label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                type="url"
                id="domain"
                name="domain"
                placeholder="https://example.com"
                required
              />
            </div>

            {/* Timezone */}
            <div className="grid gap-2">
              <Label className="font-extrabold">Timezone</Label>

              <Select
                value={timezone}
                onValueChange={(value) => setTimezone(value as string)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value) =>
                      value
                        ? TIMEZONES.find((tz) => tz.value === value)?.label
                        : "Select timezone"
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Timezones</SelectLabel>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* CheckBox for development */}
            <div className="flex ml-0.5 items-center gap-3">
              <Checkbox
                checked={enableLocalHostTracking}
                onCheckedChange={(value) =>
                  setEnableLocalHostTracking(value as boolean)
                }
                id="terms"
              />
              <Label htmlFor="terms">Enable Development Mode</Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={loading} type="submit" className="cursor-pointer">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Website
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewWebsiteDialog;
