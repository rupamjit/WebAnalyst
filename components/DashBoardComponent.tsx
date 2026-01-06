"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Layers, Loader2, Plus } from "lucide-react";
import NewWebsiteDialog from "./website/NewWebsiteDialog";
import { Website } from "@/types/website";
import WebsiteCard from "./website/WebsiteCard";
import { Skeleton } from "./ui/skeleton";

interface DashBoardComponentProps {
  websites: Website[];
  loading?: boolean;
  onRefetch?: () => Promise<void>;
}

const DashBoardComponent = ({
  websites,
  loading = false,
  onRefetch,
}: DashBoardComponentProps) => {
  const [websiteList, setWebSiteList] = useState<Website[]>([]);
  const [isAddOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setWebSiteList(websites);
  }, [websites]);
  return (
    <main className="p-4">
      <div className="flex  p-2 items-center justify-between">
        <p className="font-bold text-xl">Your Website</p>
        <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
          <Plus /> Add Website
        </Button>
      </div>
      <NewWebsiteDialog 
        open={isAddOpen} 
        onOpenChange={setIsOpen}
        onSuccess={onRefetch}
      />
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3].map((item) => (
              <div 
                className="p-6 border rounded-lg space-y-4 bg-card" 
                key={item}
              >
                {/* Header section */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                
                {/* Domain section */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
                
                {/* Stats section */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
                
                {/* Footer section */}
                <div className="pt-4 border-t flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : websiteList.length == 0 ? (
          <div className="flex mt-4 p-20  flex-col gap-2 border-2 rounded-lg border-dotted  items-center justify-center ">
            <Layers size={50} />
            <p className="font-extrabold text-xl">No Website Added</p>
            <p className="text-gray-400">
              You have not added any website till now
            </p>
            <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
              <Plus /> Add Website
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {websiteList.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default DashBoardComponent;
