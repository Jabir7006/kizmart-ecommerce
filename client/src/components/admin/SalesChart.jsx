import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for the chart
const chartData = [
  { month: "Jan", sales: 4500 },
  { month: "Feb", sales: 5200 },
  { month: "Mar", sales: 4800 },
  { month: "Apr", sales: 6300 },
  { month: "May", sales: 7100 },
  { month: "Jun", sales: 6800 },
  { month: "Jul", sales: 8200 },
  { month: "Aug", sales: 7500 },
  { month: "Sep", sales: 8900 },
  { month: "Oct", sales: 9200 },
  { month: "Nov", sales: 8800 },
  { month: "Dec", sales: 10500 },
];

export function SalesChart() {
  const maxSales = Math.max(...chartData.map((d) => d.sales));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance for 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <div className="flex h-full items-end justify-between gap-2 pb-8">
            {chartData.map((data, index) => {
              const height = (data.sales / maxSales) * 100;
              return (
                <div
                  key={index}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 hidden rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground shadow-lg group-hover:block">
                    <div className="font-semibold">
                      ${data.sales.toLocaleString()}
                    </div>
                    <div className="text-[10px] opacity-90">{data.month}</div>
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full rounded-t-md bg-primary transition-all duration-300 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />

                  {/* Label */}
                  <div className="mt-2 text-xs font-medium text-muted-foreground">
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="mt-4 flex justify-between border-t pt-2 text-xs text-muted-foreground">
            <span>$0</span>
            <span>${(maxSales / 2).toLocaleString()}</span>
            <span>${maxSales.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
