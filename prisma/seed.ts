import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { robloxId: '123456789' },
    update: {},
    create: {
      robloxId: '123456789',
      username: 'TestTrader1',
      avatar: 'https://tr.rbxcdn.com/30DAY-Avatar-8E4E7A9B58C3336A8DB7DC3C4B6A86C3-T.png'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { robloxId: '987654321' },
    update: {},
    create: {
      robloxId: '987654321',
      username: 'TestTrader2',
      avatar: 'https://tr.rbxcdn.com/30DAY-Avatar-8E4E7A9B58C3336A8DB7DC3C4B6A86C3-T.png'
    }
  })

  // Create sample middleman
  const hashedPassword = await bcrypt.hash('middleman123', 10)
  const middleman = await prisma.middleman.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      password: hashedPassword,
      isAvailable: true
    }
  })

  // Create sample trades
  const trade1 = await prisma.trade.upsert({
    where: { id: 'sample-trade-1' },
    update: {},
    create: {
      id: 'sample-trade-1',
      creatorId: user1.id,
      itemName: 'Rare Brainrot Crown',
      itemImage: 'https://example.com/crown.png',
      description: 'Ultra rare limited edition brainrot crown from 2024 event',
      price: 25.99,
      status: 'ACTIVE'
    }
  })

  const trade2 = await prisma.trade.upsert({
    where: { id: 'sample-trade-2' },
    update: {},
    create: {
      id: 'sample-trade-2',
      creatorId: user2.id,
      itemName: 'Golden Brainrot Sword',
      itemImage: 'https://example.com/sword.png',
      description: 'Legendary golden sword with brainrot effects',
      price: 45.00,
      status: 'ACTIVE'
    }
  })

  // Create sample trade participant
  await prisma.tradeParticipant.upsert({
    where: {
      tradeId_userId: {
        tradeId: trade1.id,
        userId: user2.id
      }
    },
    update: {},
    create: {
      tradeId: trade1.id,
      userId: user2.id,
      role: 'buyer'
    }
  })

  // Create sample chat messages
  await prisma.chatMessage.upsert({
    where: { id: 'sample-message-1' },
    update: {},
    create: {
      id: 'sample-message-1',
      tradeId: trade1.id,
      userId: user2.id,
      content: 'Hi, I am interested in your crown!'
    }
  })

  await prisma.chatMessage.upsert({
    where: { id: 'sample-message-2' },
    update: {},
    create: {
      id: 'sample-message-2',
      tradeId: trade1.id,
      userId: user1.id,
      content: 'Great! It is available for $25.99'
    }
  })

  console.log('Database seeded successfully!')
  console.log('Sample users:', { user1, user2 })
  console.log('Sample middleman:', middleman)
  console.log('Sample trades:', { trade1, trade2 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })