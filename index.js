const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eejaer0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database Connected");

  } catch (error) {
    res.send({
      success: false,
      error: error.message
    });
  };
};

// run mongodb
dbConnect();

// collections
const postsCollection = client.db('socioApp1').collection('posts');

// add a post
app.post('/post', async (req, res) => {
  try {
    const postData = req.body;
    const result = await postsCollection.insertOne(postData);

    res.status(200).json(result);

  } catch (err) {
    res.status(400).send({
      success: false,
      error: err.message
    })
  }
})

// get all posts data
app.get('/posts', async (req, res) => {
  try {
    const query = {};
    const cursor = postsCollection.find(query);
    const result = await cursor.toArray();

    res.status(200).json(result);

  } catch (err) {
    res.status(400).send({
      success: false,
      error: err.message
    })
  }
});

// get single data
app.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await postsCollection.findOne(query);

    res.status(200).json(result);

  } catch (err) {
    res.status(400).send({
      success: false,
      error: err.message
    })
  }
});

// update a post
app.put('/posts/update/:id', async (req, res) => {
  try {
    const id = req.params.id;

  } catch (error) {
    res.status(400).send({
      success: false,
      error: err.message
    })
  }
})

// delete a post
app.delete('/posts/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await postsCollection.deleteOne(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({
      success: false,
      error: err.message
    })
  }
})

app.get('/', (req, res) => {
  res.send('Socio app server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});