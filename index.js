const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb uri and connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iajji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('carStoreInformation');
        const productsCollection =  database.collection('products');
        const orderCollection =  database.collection('orders')
        //get products
        app.get('/products', async(req,res)=>{
            const cursor = productsCollection.find({});
            const products =  await cursor.toArray();
            res.send(products)
        });
        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
         });
    }
    finally{
        //await client.close();
    }
}


//call the async function
run().catch(console.dir)

//to check the side is running.
app.get('/', (req, res) => {
    res.send('Car website server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})
