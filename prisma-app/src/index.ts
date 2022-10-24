import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json());

app.get('/users:id', async (req, res) => {
  const { id } = req.params;
  const users = await prisma.user.findMany();
  res.json(users)
});

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`),
)