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
    response = {"response":"Deleting tickets : Something went wrong..."}
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