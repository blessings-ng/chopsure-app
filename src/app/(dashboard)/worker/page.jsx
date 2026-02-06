"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, QrCode, Utensils } from "lucide-react";

export default function WorkerDashboard() {
  // Mock data for the frontend build
  const dailyLimit = 2500;
  const currentSpent = 1200;
  const progressValue = (currentSpent / dailyLimit) * 100;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, Blessing</h1>
          <p className="text-sm text-muted-foreground">Ready for lunch?</p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-primary border-orange-200">
          Active Plan
        </Badge>
      </div>

      {/* 2. The Main Wallet Card (Hustle Orange) */}
      <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Wallet size={80} />
        </div>
        <CardHeader>
          <CardTitle className="text-orange-100 font-medium text-sm">Available Balance</CardTitle>
          <div className="text-4xl font-black mt-1">₦ 15,400.00</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-orange-100">
              <span>Daily Limit Spent</span>
              <span>₦{currentSpent} / ₦{dailyLimit}</span>
            </div>
            <Progress value={progressValue} className="h-2 bg-orange-900/20" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Button size="lg" className="h-24 flex flex-col gap-2 font-bold shadow-lg">
          <QrCode className="h-6 w-6" />
          Scan to Pay
        </Button>
        <Button variant="outline" size="lg" className="h-24 flex flex-col gap-2 border-2">
          <Utensils className="h-6 w-6 text-primary" />
          Find Food
        </Button>
      </div>

      {/* 4. Recent Activity Preview */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800">Today's Transactions</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-full text-primary">
                <Utensils size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">Mama Cass (Lunch)</p>
                <p className="text-xs text-muted-foreground">12:30 PM</p>
              </div>
            </div>
            <span className="font-bold text-slate-900">-₦1,200</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}