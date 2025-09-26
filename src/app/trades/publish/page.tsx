"use client";

import { AlertCircle, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";

export default function PublishTradePage() {
  const [formData, setFormData] = useState({
    brainrotName: "",
    description: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    const PublishDelay = 2000;
    await new Promise((resolve) => setTimeout(resolve, PublishDelay));

    setIsLoading(false);
    setIsPublished(true);
  };

  if (isPublished) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                Trade Published Successfully!
              </CardTitle>
              <CardDescription>
                Your Brainrot &quot;{formData.brainrotName}&quot; is now
                available for trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4">
                <Link href="/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
                <Link href="/trades/publish">
                  <Button variant="outline">Publish Another</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
            href="/dashboard"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mb-2 font-bold text-3xl">Publish a Trade</h1>
          <p className="text-muted-foreground">
            List your Brainrot for others to discover and trade
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Trade Details</CardTitle>
            <CardDescription>
              Provide information about your Brainrot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="brainrotName">Brainrot Name</Label>
                <Input
                  disabled={isLoading}
                  id="brainrotName"
                  name="brainrotName"
                  onChange={handleInputChange}
                  placeholder="Enter the name of your Brainrot"
                  required
                  type="text"
                  value={formData.brainrotName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  className="min-h-[100px] w-full resize-none rounded-md border border-border bg-input px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                  id="description"
                  name="description"
                  onChange={handleInputChange}
                  placeholder="Add any additional details about your Brainrot..."
                  value={formData.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Asking Price (Robux)</Label>
                <Input
                  disabled={isLoading}
                  id="price"
                  name="price"
                  onChange={handleInputChange}
                  placeholder="1000"
                  type="number"
                  value={formData.price}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Brainrot Image</Label>
                <div className="rounded-lg border-2 border-border border-dashed p-6">
                  {imagePreview ? (
                    <div className="text-center">
                      <Image
                        alt="Preview"
                        className="mx-auto mb-4 max-h-48 rounded-md"
                        height={192}
                        src={imagePreview}
                        width={256}
                      />
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview("");
                        }}
                        type="button"
                        variant="outline"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label
                      className="flex cursor-pointer flex-col items-center rounded-md p-4 transition-colors hover:bg-muted/20"
                      htmlFor="image"
                    >
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="mb-1 text-muted-foreground text-sm">
                        Click to upload image
                      </span>
                      <span className="text-muted-foreground text-xs">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        accept="image/*"
                        className="hidden"
                        disabled={isLoading}
                        id="image"
                        onChange={handleImageChange}
                        type="file"
                      />
                    </label>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                className="btn-primary w-full"
                disabled={isLoading || !formData.brainrotName}
                type="submit"
              >
                {isLoading ? "Publishing..." : "Publish Trade"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
