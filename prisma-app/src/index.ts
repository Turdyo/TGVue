import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

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
    res.json({"error":"Something went wrong..."})
  });
});

app.post('/users/:id/updatePwd', async (req, res) => {
  const { id } = req.params;
  const newPwd = req.body.password;

  prisma.user.update({
    where: {
      id: String(id),
    },
    data: {
      password: newPwd
    }
  })
  .then(response => res.json(response))
  .catch(e => {
    console.log(e);
    res.json({"error":"Something went wrong..."})
  })
});

app.post('/users/:id/addTicket', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  prisma.ticket.create({
    data:{
      ownerId: String(id),
      start_station: body.start_station,
      end_station: body.end_station,
      price: body.price,
      date: body.date
    }
  })
  .then(response => res.json(response))
  .catch(e => {
    console.log(e);
    res.json({"error":"Something went wrong..."})
  });
});


// Delete tickets first and user then to prevent any issue
app.delete('/users/:id/deleteAccount', async (req, res) => {
  const { id } = req.params;

  let deleteTicket = true;
  let response = {"response":"User and tickets Deleted."};

  await prisma.ticket.deleteMany({
    where:{
      ownerId: id
    }
  })
  .catch(e => {
    deleteTicket = false;
    console.log(e);
    response = {"response":"Deleting tickets : Something went wrong..."};
  });

  if(deleteTicket) {
    await prisma.user.delete({
      where:{
        id: id
      }
    })
    .catch(e => {
      console.log(e);
      response = {"response":"Deleting user : Something went wrong..."};
    });
  }

  res.json(response);
})

app.post('/createUser', async (req, res) => {
  const body = req.body;

  prisma.user.create({
    data: {
      email: body.email,
      lastName: body.lastName,
      firstName: body.firstName,
      password: bcrypt.hashSync(body.password)
    }
  })
  .then(user => res.status(200).json({
    id: user.id,
    token: jwt.sign(
      { UserId: user.id, UserEmail: user.email, UserLast: user.lastName },
      process.env.SECRET, // Carreful to create it in the prisma-app/.env
      { expiresIn: 86400 }
    )
  }))
  .catch(e => {
    console.log(e)
    res.status(500).json({"error":"Something went wrong..."})
  });
})

app.get('/login', async (req, res) => {
  const body = req.body;

  prisma.user.findUnique({
    where:{
      email: body.email
    }
  })
  .then(user => {
    if(!user) return res.status(401).json({error: "user not found"});
    
    bcrypt.compare(body.password, user.password)
    .then((valid: any) => {
      if(!valid) return res.status(401).json({error: "password incorrect"});
      res.status(200).json({
        id: user.id,
        token: jwt.sign(
          { UserId: user.id, UserEmail: user.email, UserLast: user.lastName },
          process.env.SECRET, // Carreful to create it in the prisma-app/.env
          { expiresIn: 86400 }
        )
      })
    })
    .catch((error: any) => res.status(500).json({ error }))
  });
})

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`),
)