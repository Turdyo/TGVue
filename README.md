# TGVue

## Pair Programming

Nous avons utilisés l'extension code-together de vscode pour faire du pair programming durant la majeure partie de ce projet, c'est pourquoi la majorité des commits viennent du même compte.

>https://doc.navitia.io  
>https://playground.navitia.io/

## Backend

### Information & basic usage

The rest api of the project is an express server using the prisma ORM connected to a mongodb database.

To run it, please enter the `prisma-app` folder and enter the command :
> npm install
> npm run dev

### Models

Two models have been created via prisma for this database :

- ***User*** : represent an account and permits someone to save its buyed train tickets. It is composed of :
    - Id : MongoDB ObjectId
    - email : String
    - lastName : String
    - firstName : String
    - password : String
    - tickets : List of Ticket

- ***Ticket*** : represent the train ticket of an user. It is composed of :
    - Id : MongoDB ObjectId
    - start_station : String
    - end_station : String
    - date : DateTime
    - price : Float, with a default price of 1.00
    - owner : User, defined a relation with the "ownerId" attribute.
    - ownerId : String

### Endpoints

This api has **7 endpoints**. Every single one of them is accessible via the `auth` service.
It is decomposed in two childen services : **user** and **auth**.

#### User services

These services needs user authentication token. It is accessible via the `/api/users` path. 

In order to return data, a token has to be send into the `authorizations` header as :

`Bearer TOKEN_VALUE` or `Token TOKEN_VALUE`

Here is the list of the user endpoints  :

- `/:id` : returns data about a user. The param id permits the server to find the user and return the needed data:      
    - lastName,
    - firstName, 
    - email, 
    - list of Tickets
    
    **METHOD** : `GET`


- `/:id/updatePwd` : change the password of the specified user. Need a body composed of : 
    - password

    **METHOD** : `PUT`

- `/:id/addTicket` : Add a ticket to the specified user. Need a body composed of :
    - ownerId (id of the user),
    - start_station,
    - end_station,
    - price,
    - date

    **METHOD** : `POST`

- `/:id/deleteAccount` : delete the tickets of the specified user as well as the user itself from the database.

    **METHOD** : `DELETE` 

#### Auth services

These services permits an user of the app to connect by sending back a authentication token. It is accessible via the `api/auth` path. Each new connection to the application creates a new token. They have a validity time of 24 hours.

Here is the list of the auth services :

- `/createUser` : create a new user and add it to the database. Returns a token. Needs :
    - email,
    - lastName,
    - firstName,
    - password (will be hashed in the database)

    **METHOD** : `POST`

- `/login` : log a user. Returns a token. Needs :
    - email,
    - password.
    **METHOD** : `GET`
