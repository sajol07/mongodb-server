const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId   
const app = express();
const port = process.env.PORT || 5000;


//------Middleware--------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60qwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);


async function run(){
     try{
        await client.connect();
        console.log('database connected successfully')
        const database = client.db('travelAgency');
        const servicesCollection = database.collection('services');
        
        //-------------GET Products API-----------
        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const places = await cursor.toArray();
            // const count = await cursor.count();
            res.send(places);
        })
        //--------------POST API-------------
        app.post('/places', async(req, res) => {
            const place = req.body;
            console.log('hit the post API', place)
            
            const result = await servicesCollection.insertOne(place);
            console.log(result)
            res.json(result)
        })



     }
     finally{
        //  await client.close();
     }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Server running on port', port)
})