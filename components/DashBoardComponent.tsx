"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Layers, Plus } from "lucide-react";
import NewWebsiteDialog from "./NewWebsiteDialog";

const DashBoardComponent = () => {
  const [websiteList, setWebSiteList] = useState([]);
  const [isAddOpen, setIsOpen] = useState(false);
  return (
    <main className="p-4">
      <div className="flex  p-2 items-center justify-between">
        <p className="font-bold text-xl">Your Website</p>
        <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
          <Plus /> Add Website
        </Button>
      </div>
      <NewWebsiteDialog open={isAddOpen} onOpenChange={setIsOpen} />
      <div>
        {websiteList.length == 0 ? (
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
        ) : null}
      </div>
    </main>
  );
};

export default DashBoardComponent;
