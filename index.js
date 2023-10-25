const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;
//const uri = `mongodb+srv://coffee-server:g9XZSEwofS7ONrzj@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

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


        // coffee collection 

        const coffeeCollection = client.db("Coffee_DB").collection("coffee");


        // trying to get coffee data from server 

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);


        })

        // searching specifics item by id for update 
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // update an item 
        // app.put('/coffee/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const filter = {_id: new ObjectId(id)}
        //     const options = { upsert: true };
        //     const updatedDoc = req.body;
        //     const Doc ={
        //         $set: {
        //             coffeeName: updateDoc.coffeeName, chefName: updateDoc.chefName,
        //              supplier: updateDoc.supplier, taste: updateDoc.taste, 
        //             category: updateDoc.category, details: updatedDoc.details, photo: updateDoc.photo
        //         }
        //     }
        //     const result = await coffeeCollection.updateOne(filter, Doc, options);
        //     res.send(result);
        // })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCoffee = req.body;

            const coffee = {
                $set: {
                    coffeeName: updatedCoffee.coffeeName, chefName: updatedCoffee.chefName,
                    supplier: updatedCoffee.supplier, taste: updatedCoffee.taste,
                    category: updatedCoffee.category, details: updatedCoffee.details, photo: updatedCoffee.photo
                }
            }

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        //try to post coffee from client side 
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);

            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);

            // sending data to the server 


        })
        // delete item from database server 
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);

        })


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
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
    res.send('Hello World!')
})

//coffee-server
//g9XZSEwofS7ONrzj

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})