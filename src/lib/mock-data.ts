export interface PrivateServer {
  id: string;
  name: string;
  description: string;
  price: number;
  serverLink: string;
  middlemanEmail: string;
  isAvailable: boolean;
}

export interface TradeRequest {
  id: string;
  privateServerId: string;
  buyerRobloxUsername: string;
  sellerRobloxUsername: string;
  stripePaymentId: string | null;
  stripePaymentStatus: "pending" | "completed" | "failed";
  isPaid: boolean;
  createdAt: Date;
}

// Mock private servers data
export const mockPrivateServers: PrivateServer[] = [
  {
    id: "server-1",
    name: "🔥 Skibidi Trade Zone",
    description:
      "Serveur premium avec middleman certifié pour tous vos trades brainrot. Sécurisé et rapide !",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/123456789/private-server-link-1",
    middlemanEmail: "middleman1@legitbrainrot.com",
    isAvailable: true,
  },
  {
    id: "server-2",
    name: "⚡ Ohio Sigma Palace",
    description:
      "Le meilleur serveur pour trader en toute sécurité. Middleman expérimenté disponible 24/7.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/987654321/private-server-link-2",
    middlemanEmail: "middleman2@legitbrainrot.com",
    isAvailable: true,
  },
  {
    id: "server-3",
    name: "💎 Gyatt Rizz VIP",
    description:
      "Serveur VIP pour les trades de qualité. Protection maximale garantie.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/456789123/private-server-link-3",
    middlemanEmail: "middleman3@legitbrainrot.com",
    isAvailable: true,
  },
  {
    id: "server-4",
    name: "🌟 Brainrot Exchange Pro",
    description:
      "Service professionnel de middleman. Trades sécurisés depuis 2024.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/321654987/private-server-link-4",
    middlemanEmail: "middleman4@legitbrainrot.com",
    isAvailable: true,
  },
  {
    id: "server-5",
    name: "🎮 Mewing Trade Hub",
    description:
      "Hub central pour tous vos échanges. Middleman de confiance et réactif.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/789456123/private-server-link-5",
    middlemanEmail: "middleman5@legitbrainrot.com",
    isAvailable: true,
  },
  {
    id: "server-6",
    name: "🏆 Alpha Sigma Vault",
    description:
      "Le coffre-fort des trades brainrot. Zéro arnaque, 100% sécurité.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/654321789/private-server-link-6",
    middlemanEmail: "middleman6@legitbrainrot.com",
    isAvailable: false, // One unavailable for testing
  },
];

// In-memory storage for trade requests (for POC)
export const mockTradeRequests: Map<string, TradeRequest> = new Map();

// Helper functions
export function getAvailableServers(): PrivateServer[] {
  return mockPrivateServers.filter((server) => server.isAvailable);
}

export function getServerById(id: string): PrivateServer | undefined {
  return mockPrivateServers.find((server) => server.id === id);
}

export function createTradeRequest(
  serverId: string,
  buyerRobloxUsername: string,
  sellerRobloxUsername: string,
): TradeRequest {
  const id = `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const tradeRequest: TradeRequest = {
    id,
    privateServerId: serverId,
    buyerRobloxUsername,
    sellerRobloxUsername,
    stripePaymentId: null,
    stripePaymentStatus: "pending",
    isPaid: false,
    createdAt: new Date(),
  };
  mockTradeRequests.set(id, tradeRequest);
  return tradeRequest;
}

export function getTradeRequestById(id: string): TradeRequest | undefined {
  return mockTradeRequests.get(id);
}

export function updateTradeRequest(
  id: string,
  updates: Partial<TradeRequest>,
): TradeRequest | undefined {
  const tradeRequest = mockTradeRequests.get(id);
  if (!tradeRequest) return undefined;

  const updated = { ...tradeRequest, ...updates };
  mockTradeRequests.set(id, updated);
  return updated;
}
