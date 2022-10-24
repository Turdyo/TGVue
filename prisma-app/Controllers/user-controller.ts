import { PrismaClient } from '@prisma/client';
import { getToken } from './auth-controller';

const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

export const getUserData = (req: any, res: any) => {
    const { id } = req.params;
  
    const token = getToken(req);
    if(token !== null && jwt.verify(token, process.env.SECRET)) {
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
      .then(user => res.status(200).json(user))
      .catch(e => {
        console.log(e);
        res.status(401).json({"error":"Something went wrong..."})
      });
    }
    else return res.status(401).json({"error":"Not valid token"})
}

export const setNewPassword = (req: any, res: any) => {
    const { id } = req.params;
    const newPwd = req.body.password;
  
    const token = getToken(req);
    if(token !== null && jwt.verify(token, process.env.SECRET)) {
        prisma.user.update({
            where: {
                id: String(id),
            },
            data: {
                password: newPwd
            }
            })
            .then(() => res.status(200).json({'response':'Password updated'}))
            .catch(e => {
            console.log(e);
            res.status(401).json({"error":"Something went wrong..."})
        })
    }
    else return res.status(401).json({"error":"Not valid token"})
}

export const addTicketToUser = (req: any, res: any) => {
    const { id } = req.params;
    const body = req.body;
  
    const token = getToken(req);
    if(token !== null && jwt.verify(token, process.env.SECRET)) {
        prisma.ticket.create({
          data:{
            ownerId: String(id),
            start_station: body.start_station,
            end_station: body.end_station,
            price: body.price,
            date: body.date
          }
        })
        .then(() => res.status(200).json({'response':'Ticket created'}))
        .catch(e => {
          console.log(e);
          res.status(401).json({"error":"Something went wrong..."})
        });
    }
    else return res.status(401).json({"error":"Not valid token"})
}

export const deleteAccount = async (req: any, res: any) => {
    const { id } = req.params;
  
    let deleteTicket = true;
  
    const token = getToken(req);
    if(token !== null && jwt.verify(token, process.env.SECRET)) {
        await prisma.ticket.deleteMany({
          where:{
            ownerId: id
          }
        })
        .catch(e => {
          deleteTicket = false;
          console.log(e);
          return res.status(401).json({"error":"Deleting tickets : something went wrong..."});
        });
      
        if(deleteTicket) {
          await prisma.user.delete({
            where:{
              id: id
            }
          })
          .catch(e => {
            console.log(e);
            return res.status(401).json({"error":"Deleting user : User not found..."});
          });
        }
      
        res.status(200).json({"response":"User deleted"});
    }
    else return res.status(401).json({"error":"Not valid token"})
}