"use client";

import { useState } from "react";
import { CountryStats, RegionStats, CityStats } from "@/types/analytics";

interface CountriesMapProps {
  countries: CountryStats[];
  regions?: RegionStats[];
  cities?: CityStats[];
}

type TabType = "map" | "countries" | "regions" | "cities";

export default function CountriesMap({ countries, regions, cities }: CountriesMapProps) {
  const [activeTab, setActiveTab] = useState<TabType>("countries");

  const activeData = activeTab === "countries" ? countries 
    : activeTab === "regions" ? (regions || [])
    : activeTab === "cities" ? (cities || [])
    : [];

  const maxCount = activeData.length > 0 ? Math.max(...activeData.map((c) => c.count)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("map")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "map"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab("countries")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "countries"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Countries
        </button>
        <button
          onClick={() => setActiveTab("regions")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "regions"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Regions
        </button>
        <button
          onClick={() => setActiveTab("cities")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "cities"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Cities
        </button>
      </div>

      {activeTab === "map" ? (
        <div className="relative h-64 bg-indigo-50/30 rounded-xl overflow-hidden flex items-center justify-center border border-indigo-100/50">
          <svg
            viewBox="0 0 1000 450"
            className="w-full h-full text-indigo-200 fill-current"
            style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.05))" }}
          >
             <path d="M162,113 C149,112 138,107 127,100 C118,94 110,88 103,98 C95,108 100,123 93,132 C85,141 73,142 66,151 C59,160 63,172 63,184 C63,195 56,204 63,214 C70,223 83,219 92,223 C101,227 101,239 108,247 C115,255 125,257 131,265 C137,273 133,285 137,294 C141,303 151,308 152,318 C153,328 143,334 140,344 C137,354 143,365 145,375 C147,385 158,389 164,398 C170,407 178,414 187,411 C196,408 201,398 210,394 C219,390 229,393 234,384 C239,375 241,364 246,356 C251,348 261,343 266,335 C271,327 272,317 278,310 C284,303 294,298 300,290 C306,282 312,274 316,265 C320,256 322,246 326,238 C330,230 340,225 342,216 C344,207 341,197 344,188 C347,179 357,173 359,164 C361,155 358,146 354,138 C350,130 341,126 339,117 C337,108 343,99 344,90 C345,81 338,73 332,67 C326,61 316,58 309,64 C302,70 299,81 292,87 C285,93 273,93 266,99 C259,105 258,116 251,121 C244,126 233,126 226,129 C219,132 214,142 206,144 C198,146 189,141 181,142 C173,143 166,151 158,153 C150,155 141,150 134,147 C127,144 121,136 127,128 C133,120 142,122 150,119 C158,116 166,113 162,113 Z" /> {/* Americas */}
             <path d="M497,97 C488,96 480,91 471,94 C462,97 458,107 449,111 C440,115 429,115 421,119 C413,123 410,133 403,139 C396,145 385,146 380,154 C375,162 380,173 381,183 C382,193 376,202 380,211 C384,220 393,225 396,234 C399,243 398,253 403,261 C408,269 418,274 423,282 C428,290 429,301 435,308 C441,315 451,319 457,326 C463,333 466,344 473,350 C480,356 490,358 497,364 C504,370 509,380 517,384 C525,388 534,386 542,388 C550,390 557,398 565,398 C573,398 580,390 588,389 C596,388 605,391 612,387 C619,383 623,374 629,368 C635,362 645,357 649,349 C653,341 654,331 658,323 C662,315 671,309 673,301 C675,293 671,284 669,275 C667,266 673,257 671,248 C669,239 661,234 656,226 C651,218 649,208 644,200 C639,192 630,188 624,181 C618,174 615,164 609,158 C603,152 593,150 586,145 C579,140 575,130 568,126 C561,122 551,122 544,118 C537,114 533,105 526,101 C519,97 508,98 501,95 C499,95 498,96 497,97 Z" /> {/* Africa & Europe */}
             <path d="M608,76 C601,75 593,71 586,72 C579,73 573,81 566,84 C559,87 550,86 544,91 C538,96 537,106 531,112 C525,118 515,121 510,128 C505,135 507,146 502,153 C497,160 487,162 483,170 C479,178 481,189 478,197 C475,205 466,211 465,220 C464,229 469,239 470,248 C471,257 465,266 467,275 C469,284 476,290 480,298 C484,306 486,316 491,323 C496,330 505,334 511,340 C517,346 521,356 528,360 C535,364 544,364 551,367 C558,370 564,378 572,379 C580,380 587,373 595,372 C603,371 611,374 618,371 C625,368 629,359 635,354 C641,349 650,344 654,337 C658,330 659,320 663,313 C667,306 676,301 678,293 C680,285 677,276 676,267 C675,258 680,249 678,240 C676,231 668,226 664,218 C660,210 658,200 654,192 C650,184 641,180 635,173 C629,166 626,156 620,150 C614,144 604,142 597,137 C590,132 586,122 579,118 C572,114 562,114 555,110 C548,106 544,97 537,93 C530,89 519,90 512,87 C505,84 498,90 491,89 L491,89" /> {/* Asia (merged with Europe rough) */}
             <path d="M783,313 C778,311 772,308 767,313 C762,318 763,329 759,335 C755,341 745,344 743,352 C741,360 746,369 746,377 C746,385 739,392 741,400 C743,408 752,412 756,419 C760,426 767,432 774,435 C781,438 790,436 797,435 C804,434 812,429 817,423 C822,417 824,407 828,400 C832,393 841,389 843,381 C845,373 842,364 841,356 C840,348 834,342 830,335 C826,328 824,318 818,313 C812,308 803,307 796,305 C789,303 782,308 775,308" /> {/* Australia */}
             <path d="M856,124 C853,121 850,115 845,116 C840,117 838,126 835,130 C832,134 824,136 822,142 C820,148 824,155 824,161 C824,167 819,173 821,179 C823,185 831,189 834,194 C837,199 844,203 850,204 C856,205 863,200 869,198 C875,196 882,192 885,186 C888,180 889,171 889,165 C889,159 884,153 881,148 C878,143 875,134 870,131 C865,128 857,128 852,125" /> {/* Japan */}
          </svg>
          
          {/* Animated active markers */}
          {countries.slice(0, 10).map((country, index) => {
            const coords = getCountryCoordinates(country.country);
            return (
              <div
                key={index}
                className="absolute flex items-center justify-center group pointer-events-none"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping absolute opacity-40"></div>
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full relative shadow-[0_0_10px_rgba(79,70,229,0.5)] border-[1.5px] border-white z-10 transition-transform hover:scale-150"></div>
                
                {/* Tooltip (always visible on hover of parent area if we enabled pointer events, currently simplified) */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-gray-900/90 backdrop-blur-md text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 whitespace-nowrap z-20 shadow-xl border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span>{getCountryFlag(country.country)}</span>
                    <span>{country.country}</span>
                    <span className="opacity-50">|</span>
                    <span className="font-bold">{country.count.toLocaleString()}</span>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/90"></div>
                </div>
              </div>
            );
          })}
          
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-semibold text-indigo-900 border border-indigo-100 shadow-sm z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live User Activity
          </div>
        </div>
      ) : (
        /* Generic List for Countries/Regions/Cities */
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
            <span>Name</span>
            <span>Visitors</span>
          </div>
          
          {activeData.length > 0 ? (
            activeData.slice(0, 10).map((item, index) => {
              let name = "Unknown";
              let displayFlag = "📍";
              const count = item.count;

              if ("city" in item) {
                name = (item as CityStats).city;
                displayFlag = "🏙️";
              } else if ("region" in item) {
                name = (item as RegionStats).region;
                displayFlag = "🗺️";
              } else if ("country" in item) {
                name = (item as CountryStats).country;
                displayFlag = getCountryFlag(name);
              }

              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={index} className="relative group">
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-50 rounded transition-all group-hover:bg-indigo-100"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between py-2 px-3">
                    <div className="flex items-center gap-2">
                       <span className="text-base">{displayFlag}</span>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                        {name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No data available for {activeTab}</p>
          )}
        </div>
      )}
    </div>
  );
}

function getCountryFlag(country: string): string {
  const c = country?.toLowerCase() || "";
  if (c.includes("united states") || c === "us" || c === "usa") return "🇺🇸";
  if (c.includes("india") || c === "in") return "🇮🇳";
  if (c.includes("united kingdom") || c === "uk" || c === "gb") return "🇬🇧";
  if (c.includes("germany") || c === "de") return "🇩🇪";
  if (c.includes("france") || c === "fr") return "🇫🇷";
  if (c.includes("canada") || c === "ca") return "🇨🇦";
  if (c.includes("australia") || c === "au") return "🇦🇺";
  if (c.includes("japan") || c === "jp") return "🇯🇵";
  if (c.includes("china") || c === "cn") return "🇨🇳";
  if (c.includes("brazil") || c === "br") return "🇧🇷";
  return "🌍";
}

function getCountryCoordinates(country: string): { x: number; y: number } {
  const c = country?.toLowerCase() || "";
  
  // Coordinates based on the simplified map projection
  if (c.includes("united states") || c === "us" || c === "usa") return { x: 21, y: 35 };
  if (c.includes("canada") || c === "ca") return { x: 20, y: 15 };
  if (c.includes("brazil") || c === "br") return { x: 30, y: 65 };
  if (c.includes("united kingdom") || c === "uk" || c === "gb") return { x: 48, y: 22 };
  if (c.includes("france") || c === "fr") return { x: 49, y: 28 };
  if (c.includes("germany") || c === "de") return { x: 51, y: 25 };
  if (c.includes("india") || c === "in") return { x: 70, y: 42 };
  if (c.includes("china") || c === "cn") return { x: 78, y: 35 };
  if (c.includes("japan") || c === "jp") return { x: 88, y: 32 };
  if (c.includes("australia") || c === "au") return { x: 85, y: 75 };
  if (c.includes("russia") || c === "ru") return { x: 65, y: 15 };
  
  const randomLandCoords = [
    { x: 53, y: 55 }, // Africa
    { x: 20, y: 30 }, // NA
    { x: 30, y: 60 }, // SA
    { x: 50, y: 25 }, // EU
    { x: 75, y: 35 }, // AS
  ];
  const idx = Math.abs(country.length) % randomLandCoords.length;
  return randomLandCoords[idx];
}
