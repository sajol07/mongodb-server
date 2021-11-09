const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;  

const app = express();
const port = process.env.PORT || 5000;


//------Middleware--------
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lubi3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
     try{
        await client.connect();
        console.log('database connected successfully')
        const database = client.db('travelAgency');
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');
        
        //-------------GET All Places API-----------
        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const places = await cursor.toArray();
            // const count = await cursor.count();
            res.send(places);
        })

        // --------------Get Individual  Place-----------
        app.get('/place/:id', async(req, res) => {
            console.log(req.params.id)
            const result = await servicesCollection.find({_id: ObjectId(req.params.id) }).toArray();
            // console.log(result)
            res.send(result[0])
        })


        //--------------POST API-------------------
        app.post('/places', async(req, res) => {
            const place = req.body;
            // console.log('hit the post API', place)
            const result = await servicesCollection.insertOne(place);
            // console.log(result)
            res.json(result)
        })

        //-----------------DELETE API-----------------
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query)
            // console.log('delete place ', result, id);
            res.json(id)

        })
        
        //-------------------Book Tour---------------------
        app.post('/book-tour', async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body);
            res.send(result);
         })

         //-------------------Booked Order------------------
         app.get('/myOrders/:email', async (req, res) => {
             const result = await bookingsCollection.find({}).toArray();     
             //find Operation not working
             //const result = await bookingsCollection.find({email: req.params.email}).toArray(); 
             res.send(result)
         })
         //-------------Cancle Booking--------------------
         app.delete("/delteOrder/:id", async (req, res) => {
            const result = await bookingsCollection.deleteOne({
              _id: ObjectId(req.params.id),
            });
            res.send(result);
          });
        

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