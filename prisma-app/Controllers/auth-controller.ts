import { PrismaClient } from '@prisma/client';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

export function getToken(req: { headers: { [x: string]: any; }; }) {
    const authorization = req.headers["authorization"];
    if (authorization === undefined) return null;
    return authorization.replace("Bearer ", "").replace("Token ", "");
}

export const createNewAccount = (req: any, res: any) => {
    const body = req.body;

    res.setHeader('content-type', 'application/json')

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
}

export const login = (req: any, res: any) => {
    const body = req.body;
  
    res.setHeader('content-type', 'application/json')

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
  }