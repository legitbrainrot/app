import { useState, useEffect, useRef } from 'react'
import { Input } from "./input"
import { Button } from "./button"
import { Badge } from "./badge"
import { Card, CardContent } from "./card"
import { Separator } from "./separator"
import { Search, X, Filter, SlidersHorizontal } from "lucide-react"

export interface SearchFilters {
  minPrice?: number
  maxPrice?: number
  status?: 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED'
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high'
}

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (query: string, filters: SearchFilters) => void
  filters?: SearchFilters
  onFiltersChange?: (filters: SearchFilters) => void
  placeholder?: string
  showFilters?: boolean
  isLoading?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  filters = {},
  onFiltersChange,
  placeholder = "Search for Brainrot items...",
  showFilters = true,
  isLoading = false,
  className
}: SearchBarProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value, localFilters)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    onChange('')
    if (onSearch) {
      onSearch('', localFilters)
    }
    inputRef.current?.focus()
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    setLocalFilters(clearedFilters)
    if (onFiltersChange) {
      onFiltersChange(clearedFilters)
    }
  }

  const activeFilterCount = Object.values(localFilters).filter(v => v !== undefined && v !== '').length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="pl-10 pr-10"
          />
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <>
              <Search className="h-4 w-4 mr-2 animate-pulse" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>

        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {localFilters.minPrice && (
            <Badge variant="secondary" className="gap-1">
              Min: ${localFilters.minPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('minPrice', undefined)}
              />
            </Badge>
          )}

          {localFilters.maxPrice && (
            <Badge variant="secondary" className="gap-1">
              Max: ${localFilters.maxPrice}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('maxPrice', undefined)}
              />
            </Badge>
          )}

          {localFilters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {localFilters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('status', undefined)}
              />
            </Badge>
          )}

          {localFilters.sortBy && (
            <Badge variant="secondary" className="gap-1">
              Sort: {localFilters.sortBy.replace('_', ' ')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('sortBy', undefined)}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter panel */}
      {showFilterPanel && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Search Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="h-8"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="h-8"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={localFilters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <select
                    value={localFilters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={activeFilterCount === 0}
                    className="w-full h-8"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}