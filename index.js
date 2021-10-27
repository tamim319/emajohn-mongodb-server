const express = require ('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ww2yo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try {
        await client.connect();
        const database = client.db('online_shop');
        const porductCollection = database.collection('products');

        //Get Products Api
       app.get('/products', async(req, res) => {
        //    console.log(req.query);
        const cursor = porductCollection.find({});
        const page = req.query.page;
        const size = parseInt( req.query.size);
        let products;
        const count = await cursor.count();
        if(page){
            products = await cursor.skip(page * size).limit(size).toArray();
        }
        else{
            const products = await cursor.toArray();
        }
        
        
        res.send({
            count,
            products
        });
        
       });

         //use post to get data
         app.post('/products/bykeys', async(req, res) => {
            //  console.log(req.body);
            const query = {key: {$in: keys}}
            const products = await porductCollection.find(query).toArray();
             res.json(products);
         })
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('emajon server');
});

app.listen(port, () => {
    console.log('server runnig port', port);
})