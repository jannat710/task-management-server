const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pvt8fts.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("taskDb").collection("users");
    const assignCollection = client.db("assignDb").collection("assign");


    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email }
        const existingUser = await userCollection.findOne(query);
        if (existingUser) {
            return res.send({ message: 'user already exists', insertedId: null })
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
    })
    app.post('/assign', async (req, res) => {
        const user = req.body;
        const result = await assignCollection.insertOne(user);
        res.send(result);
    })

    //         //Admin
    //         app.patch('/users/admin/:id',  async (req, res) => {
    //             const id = req.params.id;
    //             const filter = { _id: new ObjectId(id) };
    //             const updatedDoc = {
    //                 $set: {
    //                     role: 'admin'
    //                 }
    //             }
    //             const result = await userCollection.updateOne(filter, updatedDoc);
    //             res.send(result);
    //         })

    // app.delete('/users/:id',  async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: new ObjectId(id) }
    //     const result = await userCollection.deleteOne(query);
    //     res.send(result);
    // })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('task management is running')
})

app.listen(port, () => {
    console.log(`Task management is running on port ${port}`);
})