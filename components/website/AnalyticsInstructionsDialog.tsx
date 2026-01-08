"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Code } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AnalyticsInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  domain: string;
}

const AnalyticsInstructionsDialog = ({
  open,
  onOpenChange,
  websiteId,
  domain,
}: AnalyticsInstructionsDialogProps) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const trackingCode = `<!-- WebAnalyst Tracking Code -->
<script 
  src="${process.env.NEXT_PUBLIC_HOST_URL || window.location.origin}/analytics.js" 
  data-website-id="${websiteId}"
  data-domain="${domain}"
  defer
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    toast.success("Tracking code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    onOpenChange(false);
    router.push("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Setup Analytics Tracking
          </DialogTitle>
          <DialogDescription>
            Add this tracking code to your website to start collecting analytics data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Instructions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Installation Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Copy the tracking code below</li>
              <li>Paste it in the <code className="bg-muted px-1 py-0.5 rounded">&lt;head&gt;</code> section of your website</li>
              <li>Deploy your changes</li>
              <li>Start seeing analytics data in your dashboard</li>
            </ol>
          </div>

          {/* Code Block */}
          <div className="relative">
            <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-foreground whitespace-pre-wrap break-all">
                {trackingCode}
              </pre>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          {/* Website Details */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Website ID</p>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded truncate" title={websiteId}>
                {websiteId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Domain</p>
              <p className="text-sm font-mono bg-muted px-2 py-1 rounded truncate" title={domain}>
                {domain}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleDone}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsInstructionsDialog;
