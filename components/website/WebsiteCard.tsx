"use client";
import { Website } from "@/types/website";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Globe,
  Clock,
  BarChart3,
  MoreVertical,
  Eye,
  Settings,
  Trash2,
  Copy,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import AnalyticsInstructionsDialog from "./AnalyticsInstructionsDialog";

const WebsiteCard = ({ website }: { website: Website }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Extract domain name without protocol
  const getDomainName = (url: string) => {
    try {
      return url.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  // Copy website ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Website ID copied to clipboard!");
  };

  return (
    <>
    <div className="p-6 border rounded-lg space-y-4 bg-card hover:shadow-lg transition-all duration-300 hover:border-primary/50">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {getDomainName(website.domain)}
            </h3>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowInstructions(true)}>
              <Eye className="h-4 w-4 mr-2" />
              View Analytics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => copyToClipboard(website.websiteId)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Domain section */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Domain</p>
        <a
          href={website.domain}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:text-primary hover:underline transition-colors truncate block"
        >
          {website.domain}
        </a>
      </div>

      {/* Stats section - Only real data */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Timezone</span>
          </div>
          <p className="text-xs font-medium truncate" title={website.timezone}>
            {website.timezone.split("/").pop()}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            <span>Tracking</span>
          </div>
          <Badge
            variant={website.enableLocalTracking ? "default" : "secondary"}
            className="text-xs px-2 py-0 h-6"
          >
            {website.enableLocalTracking ? "Local" : "Cloud"}
          </Badge>
        </div>
      </div>

      {/* Footer section */}
      <div className="pt-4 border-t flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Created {formatDate(website.createdAt)}
        </p>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowInstructions(true)}
        >
          <Eye className="h-4 w-4 mr-1.5" />
          View
        </Button>
      </div>
    </div>
    
    {/* Analytics Instructions Dialog */}
    <AnalyticsInstructionsDialog
      open={showInstructions}
      onOpenChange={setShowInstructions}
      websiteId={website.websiteId}
      domain={website.domain}
    />
    </>
  );
};

export default WebsiteCard;