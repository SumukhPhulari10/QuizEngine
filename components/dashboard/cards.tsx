"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm font-medium">All Quizzes</h3>
          <Button size="sm">View</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Total: 18</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Active Students</h3>
          <Button size="sm">Manage</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Total: 142</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Recent Results</h3>
          <Button size="sm">View</Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Most recent quiz attempts</p>
        </CardContent>
      </Card>
    </div>
  );
}
