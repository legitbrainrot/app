"use client";

import { ArrowLeft, Camera, CheckCircle, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PublishTradePage() {
  const [brainrotName, setBrainrotName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brainrotName.trim() || !selectedImage) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      setBrainrotName("");
      setSelectedImage(null);
      setImagePreview(null);
      setShowSuccess(false);
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-100 flex items-center justify-center">
        <Card className="bg-gray-900 border-2 border-green-300 shadow-2xl max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Ton brainrot est publié !
            </h2>
            <p className="text-gray-600 mb-6">
              Il sera vérifié par notre middleman de confiance et sera visible
              pour les trades sécurisés dans quelques minutes.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700 w-full">
              <Link href="/trade">Voir tous les trades</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-gray-300 hover:bg-gray-900"
        >
          <Link href="/trade">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📤 Publie ton brainrot pour trader
          </h1>
          <p className="text-lg text-gray-600">
            Partage ton contenu brainrot et trade-le sécurisement via notre
            middleman !
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border-2 border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="block text-sm font-bold text-white mb-2">
                    📝 Nom de ton brainrot à trader
                  </p>
                  <Input
                    placeholder="Ex: Skibidi Toilet Epic Dance"
                    value={brainrotName}
                    onChange={(e) => setBrainrotName(e.target.value)}
                    className="bg-gray-50 border-2 border-green-200 focus:border-green-400 text-lg py-3"
                    required
                  />
                </div>

                <div>
                  <p className="block text-sm font-bold text-white mb-2">
                    📸 Ajoute une image
                  </p>
                  <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <Image
                          src={imagePreview}
                          alt="Aperçu"
                          width={400}
                          height={300}
                          className="max-w-full max-h-64 rounded-lg object-cover mx-auto"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="border-green-300 text-green-600"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="mx-auto h-16 w-16 text-green-400" />
                        <div>
                          <Button
                            type="button"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choisir une image
                          </Button>
                          <p className="text-sm text-green-600 mt-2">
                            JPG, PNG jusqu'à 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:from-green-700 hover:to-green-700 text-lg py-4"
                  disabled={
                    !brainrotName.trim() || !selectedImage || isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Publication en cours..."
                    : "🚀 Publier pour trader (2,50€)"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
