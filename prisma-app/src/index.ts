import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json());

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  prisma.user.findUnique({
    where:{
      id: String(id),
    },
    select:{
      firstName: true,
      lastName: true,
      email:true,
      tickets: {
        select: {
          start_station:true,
          end_station:true,
          date: true,
          price: true
        }
      }
    }
  })
  .then(user => res.json(user))
  .catch(e => {
    console.log(e);
  });
  
});

app.post('/createUser', async (req, res) => {
  const body = req.body;
  console.log(body);
  
  prisma.user.create({
    data: {
      email: body.email,
      lastName: body.lastName,
      firstName: body.firstName,
      password: body.password
    }
  })
  .then(newUser => res.json(newUser))
  .catch(e => {
    console.log(e)
    res.json({"error":"Something went wrong..."})
  });

})

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`),
)