"use client";

import { ParserDemoContent } from "./parser-demo-content";


export default function ParserDemoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Parser UI Demo</h1>
      <ParserDemoContent />
    </div>
  );
}