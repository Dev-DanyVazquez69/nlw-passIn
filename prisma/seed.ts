import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            id: '89ef19b8-c64e-4cea-a6ca-214043f4f168',
            title: 'Uefa Champions League',
            slug: 'uefa-champions-league',
            details: 'A maior champions de todas',
            maximumAttendees: 48,
        }
    })
}

seed().then(() => {
    console.log('Database seeded!')
    prisma.$disconnect()
})