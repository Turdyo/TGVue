import express from 'express';
import { getUserData, setNewPassword, addTicketToUser, deleteAccount } from './Controllers/user-controller'
import { createNewAccount, login } from './Controllers/auth-controller';

const app = express();

app.use(express.json());

app.get('api/users/:id', (req, res) => getUserData(req, res));

app.put('api/users/:id/updatePwd', async (req, res) => setNewPassword(req, res));

app.post('api/users/:id/addTicket',  (req, res) => addTicketToUser(req, res));

// Delete tickets first and user then to prevent any issue
app.delete('api/users/:id/deleteAccount', (req, res) => deleteAccount(req, res))

app.post('api/auth/createUser', (req, res) => createNewAccount(req, res))

app.get('api/auth/login', async (req, res) => login(req, res))

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
`),
)