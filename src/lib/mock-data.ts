export interface PrivateServer {
  id: string;
  name: string;
  description: string;
  price: number;
  serverLink: string;
  middlemanEmail: string;
  isAvailable: boolean;
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
    middlemanEmail: "billel93hussain@gmail.com",
    isAvailable: true,
  },
  {
    id: "server-2",
    name: "⚡ Ohio Sigma Palace",
    description:
      "Le meilleur serveur pour trader en toute sécurité. Middleman expérimenté disponible 24/7.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/987654321/private-server-link-2",
    middlemanEmail: "billel93hussain@gmail.com",
    isAvailable: true,
  },
  {
    id: "server-3",
    name: "💎 Gyatt Rizz VIP",
    description:
      "Serveur VIP pour les trades de qualité. Protection maximale garantie.",
    price: 2.5,
    serverLink: "https://www.roblox.com/games/456789123/private-server-link-3",
    middlemanEmail: "billel93hussain@gmail.com",
    isAvailable: true,
  },
];

// Helper functions
export function getAvailableServers(): PrivateServer[] {
  return mockPrivateServers.filter((server) => server.isAvailable);
}

export function getServerById(id: string): PrivateServer | undefined {
  return mockPrivateServers.find((server) => server.id === id);
}
