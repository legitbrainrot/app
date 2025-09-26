"use client";

import { Plus, Search, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Brainrot trades securely
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="group cursor-pointer transition-all duration-200 hover:border-primary/50">
            <Link href="/trades/publish">
              <CardHeader className="pb-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/30">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Publish a Trade</CardTitle>
                <CardDescription>
                  List your Brainrot for others to discover and trade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="btn-primary w-full">Start Publishing</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="group cursor-pointer transition-all duration-200 hover:border-primary/50">
            <Link href="/trades/search">
              <CardHeader className="pb-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 transition-colors group-hover:bg-primary/30">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Search Trades</CardTitle>
                <CardDescription>
                  Find and contact creators for the Brainrot you want
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="btn-secondary w-full">Browse Trades</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Active Trades
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">12</div>
              <p className="text-muted-foreground text-xs">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">48</div>
              <p className="text-muted-foreground text-xs">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Success Rate
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">96%</div>
              <p className="text-muted-foreground text-xs">Secured by escrow</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and get help</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              View Profile
            </Button>
            <Button size="sm" variant="outline">
              Trade History
            </Button>
            <Button size="sm" variant="outline">
              Account Settings
            </Button>
            <Link href="/support">
              <Button size="sm" variant="outline">
                Get Support
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
