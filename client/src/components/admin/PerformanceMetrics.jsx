import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    label: "Page Views",
    value: "245,678",
    target: "250,000",
    percentage: 98.3,
    status: "good",
  },
  {
    label: "Sales Target",
    value: "$892,456",
    target: "$1,000,000",
    percentage: 89.2,
    status: "good",
  },
  {
    label: "Customer Satisfaction",
    value: "4.8/5.0",
    target: "4.5/5.0",
    percentage: 96.0,
    status: "excellent",
  },
  {
    label: "Return Rate",
    value: "2.4%",
    target: "< 5%",
    percentage: 48.0,
    status: "excellent",
  },
];

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Track your business goals and targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <Badge
                variant={
                  metric.status === "excellent"
                    ? "success"
                    : metric.status === "good"
                    ? "default"
                    : "warning"
                }
              >
                {metric.percentage}%
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>Target: {metric.target}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all ${
                    metric.status === "excellent"
                      ? "bg-green-500"
                      : metric.status === "good"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  }`}
                  style={{ width: `${metric.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
