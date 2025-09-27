"use client";

import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const mockTrades = [
  {
    id: "1",
    name: "Sigma Grindset Compilation",
    thumbnail: "/api/placeholder/200/150",
    creator: "AlphaMale2024",
  },
  {
    id: "2",
    name: "Ohio Skibidi Moments",
    thumbnail: "/api/placeholder/200/150",
    creator: "BrainrotKing",
  },
  {
    id: "3",
    name: "Gigachad Motivation Pack",
    thumbnail: "/api/placeholder/200/150",
    creator: "MotivationMaster",
  },
  {
    id: "4",
    name: "Fanum Tax Chronicles",
    thumbnail: "/api/placeholder/200/150",
    creator: "TaxCollector",
  },
  {
    id: "5",
    name: "Rizz Tutorial Series",
    thumbnail: "/api/placeholder/200/150",
    creator: "RizzGuru",
  },
  {
    id: "6",
    name: "Based Sigma Rules",
    thumbnail: "/api/placeholder/200/150",
    creator: "BasedLord",
  },
];

export default function SearchTradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrades, setFilteredTrades] = useState(mockTrades);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTrades(mockTrades);
    } else {
      const filtered = mockTrades.filter(
        (trade) =>
          trade.name.toLowerCase().includes(query.toLowerCase()) ||
          trade.creator.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredTrades(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/trade">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trade
            </Link>
          </Button>

          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Search Trades
          </h1>
          <p className="text-muted-foreground">
            Find the brainrot content you're looking for
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by brainrot name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredTrades.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trades found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or check back later for new
                trades.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrades.map((trade) => (
              <Card
                key={trade.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">
                    {trade.name}
                  </CardTitle>
                  <CardDescription className="mb-4">
                    by {trade.creator}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link href={`/trade/room/${trade.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Creator
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTrades.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            Showing {filteredTrades.length} of {mockTrades.length} trades
          </div>
        )}
      </div>
    </div>
  );
}
