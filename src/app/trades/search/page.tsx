"use client";

import { ArrowLeft, Search, Star } from "lucide-react";
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
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { TradeCardSkeleton } from "@/components/ui/loading";

const mockResults = [
  {
    id: "1",
    name: "Ohio Gyat Rizz Supreme",
    image: "/api/placeholder/300/200",
    creator: "SkibidiMaster",
    price: "2500",
    rating: 4.8,
    trades: 23,
  },
  {
    id: "2",
    name: "Sigma Grindset Bundle",
    image: "/api/placeholder/300/200",
    creator: "AlphaBrainrot",
    price: "1800",
    rating: 4.9,
    trades: 45,
  },
  {
    id: "3",
    name: "Mewing Tutorial Deluxe",
    image: "/api/placeholder/300/200",
    creator: "JawlineGod",
    price: "3200",
    rating: 4.7,
    trades: 67,
  },
  {
    id: "4",
    name: "Fanum Tax Collection",
    image: "/api/placeholder/300/200",
    creator: "TaxCollector99",
    price: "1500",
    rating: 4.6,
    trades: 12,
  },
  {
    id: "5",
    name: "Beta Male Conversion Kit",
    image: "/api/placeholder/300/200",
    creator: "SigmaWolf",
    price: "2200",
    rating: 4.9,
    trades: 89,
  },
  {
    id: "6",
    name: "Cringe Compilation Pack",
    image: "/api/placeholder/300/200",
    creator: "CringeKing",
    price: "1200",
    rating: 4.4,
    trades: 34,
  },
];

export default function SearchTradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(mockResults);
  const [hasError, setHasError] = useState(false);

  const renderSearchResults = () => {
    if (hasError) {
      return (
        <ErrorState
          action={{
            label: "Try Again",
            onClick: () =>
              handleSearch({
                preventDefault: () => {
                  /* noop */
                },
              } as React.FormEvent),
          }}
          type="network"
        />
      );
    }

    if (isSearching) {
      return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <TradeCardSkeleton key={`skeleton-loading-${Date.now()}-${i}`} />
          ))}
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No trades found</h3>
            <p className="mb-4 text-muted-foreground">
              Try adjusting your search terms or browse all available trades
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setResults(mockResults);
              }}
            >
              Show All Trades
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((trade) => (
          <Card
            className="group transition-all duration-200 hover:border-primary/50"
            key={trade.id}
          >
            <CardHeader className="pb-3">
              <div className="mb-3 aspect-video overflow-hidden rounded-md bg-muted">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-muted-foreground text-sm">
                    {trade.name}
                  </span>
                </div>
              </div>
              <CardTitle className="text-base">{trade.name}</CardTitle>
              <CardDescription className="text-xs">description</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bold text-lg text-primary">
                  {trade.price} R$
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-muted-foreground text-xs">
                    {trade.rating}
                  </span>
                </div>
              </div>
              <Button className="btn-primary w-full" size="sm">
                Contact Creator
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasError(false);

    try {
      // Simulate API call
      const SearchDelay = 800;
      await new Promise((resolve) => setTimeout(resolve, SearchDelay));

      // Simulate occasional error (10% chance)
      const ErrorProbability = 0.1;
      if (Math.random() < ErrorProbability) {
        throw new Error("Network error");
      }

      // Filter results based on search query
      if (searchQuery) {
        const filtered = mockResults.filter(
          (result) =>
            result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.creator.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setResults(filtered);
      } else {
        setResults(mockResults);
      }
    } catch (_error) {
      setHasError(true);
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
            href="/dashboard"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mb-2 font-bold text-3xl">Search Trades</h1>
          <p className="text-muted-foreground">
            Find the Brainrot you're looking for
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form className="flex gap-4" onSubmit={handleSearch}>
              <div className="flex-1">
                <Input
                  className="h-12 text-lg"
                  disabled={isSearching}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Brainrot name, creator, or keywords..."
                  type="text"
                  value={searchQuery}
                />
              </div>
              <Button
                className="btn-primary h-12 px-8"
                disabled={isSearching}
                type="submit"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h2 className="mb-2 font-semibold text-xl">
            {searchQuery ? `Results for "${searchQuery}"` : "All Trades"}
          </h2>
          <p className="text-muted-foreground">
            {results.length} trade{results.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {renderSearchResults()}
      </div>
    </div>
  );
}
