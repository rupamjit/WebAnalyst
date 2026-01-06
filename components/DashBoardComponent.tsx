"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Layers, Plus } from "lucide-react";

const DashBoardComponent = () => {
  const [websiteList, setWebSiteList] = useState([]);
  return (
    <main className="p-4  ">
      <div className="flex items-center justify-between">
        <p className="font-bold text-xl">Your Website</p>
        <Button className="cursor-pointer">
          <Plus /> Add Website
        </Button>
      </div>
      <div>
        {websiteList.length == 0 ? (
          <div className="flex mt-4 p-20  flex-col gap-2 border-2 rounded-lg border-dotted  items-center justify-center ">
            <Layers size={50}/>
            <p className="font-extrabold text-xl">No Website Added</p>
            <p className="text-gray-400">You have not added any website till now</p>
            <Button className="cursor-pointer">
              <Plus /> Add Website
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default DashBoardComponent;
