"use client";

import React, { useEffect, useState } from "react";
import { font } from "@/font/font";
import Link from "next/link";
import ShowMap from "./showmap";

export default function Map() {
  return (
    <div>
      <div className="w-full h-[90px] bg-[#ee9ecc] text-slate-100">
        <span className={`${font.className} flex flex-row justify-between`}>
          <Link href="/" className="text-5xl pt-5 pl-7">
            Emocean
          </Link>
          <span className="flex justify-between mt-8 mr-12">
            <Link href="/share" className="text-3xl">
              share
            </Link>
            {/* <div className="text-3xl">login</div> */}
          </span>
        </span>
      </div>
      {/* <h1>map</h1> */}
      <div>
        <ShowMap />
      </div>
    </div>
  );
}
