"use client";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ruler } from "lucide-react";

export function SizeChartSheet() {
  const chartData = [
    { label: "CHEST", values: ["34", "34", "34", "34", "34", "34"] },
    { label: "WAIST", values: ["28", "28", "28", "28", "28", "28"] },
    { label: "HIPS", values: ["36", "36", "36", "36", "36", "36"] },
  ];

  const sizes = ["8/S", "10/M", "12/L", "14/XL", "16/XXL", "18/3XL"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-text-14 mt-3 flex items-center gap-1.5 font-medium tracking-tighter text-black transition-opacity hover:opacity-80">
          <Ruler className="h-3 w-3" /> View Size Chart
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="h-max w-full gap-0 overflow-auto rounded-l-xl border-none p-0 sm:max-w-md md:pb-10 lg:max-w-4xl xl:max-w-2xl xl:pb-32 [&>button]:hidden"
        //
      >
        <SheetHeader className="flex justify-between border-b border-gray-100 p-6">
          <SheetTitle className="p-text-28 font-medium text-black">Size Chart</SheetTitle>
          <SheetClose asChild>
            <button aria-label="Close" className="absolute top-4 right-4 rounded-full p-2 transition">
              ✕
            </button>
          </SheetClose>
        </SheetHeader>
        <div className="space-y-8 overflow-y-auto p-6">
          {/* Size Table */}
          <div className="overflow-hidden rounded-none border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="p-text-14 h-10 px-4 text-center text-black">SIZE</TableHead>
                  {sizes.map((size) => (
                    <TableHead key={size} className="p-text-14 h-10 px-2 text-center text-black">
                      {size}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((row, idx) => (
                  <TableRow
                    key={row.label}
                    className={`border-none ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} transition-colors hover:bg-gray-100/50`}
                  >
                    <TableCell className="p-text-14 px-4 py-4 text-black">{row.label}</TableCell>
                    {row.values.map((val, i) => (
                      <TableCell key={i} className="p-text-14 px-2 py-4 text-center font-medium text-black">
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Guidelines Section */}
          <div className="space-y-4">
            <h3 className="p-text-20 font-medium text-[#777]">How to Measure:</h3>
            <p className="p-text-16 leading-6">
              You can request a cancellation for eligible orders from My Orders or the order details page.
            </p>
            <ul className="space-y-3">
              {[
                "Always use a measuring tape and compare with our chart for the most accurate fit.",
                "Fit may vary slightly depending on fabric, cut, and design.",
                "Sizes may differ across regions (US, UK, EU, Asia). Check conversion carefully before purchase.",
                "Due to manual measurements, a difference of 1-2 cm is considered normal.",
                "Refer to model height, size, and fit notes provided for better guidance.",
                "If between two sizes, we recommend choosing the larger one for comfort.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rotate-45 bg-[#1A1A1A]" />
                  <span className="p-text-16 leading-6 text-black">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
