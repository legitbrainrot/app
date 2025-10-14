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
    name: "Serveur Brainrot 1",
    description:
      "Serveur premium avec modération professionnelle. Joue au brainrot en toute sécurité et rapidité !",
    price: 1.99,
    serverLink:
      "https://www.roblox.com/share?code=c89c8f6afff3e349841e1006d40840b2&type=Server",
    middlemanEmail: "billel93hussain@gmail.com",
    isAvailable: true,
  },
  {
    id: "server-2",
    name: "Serveur Brainrot 2",
    description:
      "Le meilleur serveur pour jouer au brainrot. Modérateurs expérimentés disponibles 24/7.",
    price: 1.99,
    serverLink:
      "https://www.roblox.com/share?code=b8f37f02cea9a74896ef84a74abbf337&type=Server",
    middlemanEmail: "billel93hussain@gmail.com",
    isAvailable: true,
  },
  {
    id: "server-3",
    name: "Serveur Brainrot 3",
    description:
      "Serveur VIP pour une expérience de qualité. Modération maximale garantie.",
    price: 1.99,
    serverLink:
      "https://www.roblox.com/share?code=bc1f5a953545f64aa702504f584a1f98&type=Server",
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
