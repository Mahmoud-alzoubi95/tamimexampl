'use strict';

require("dotenv").config();
const methodOverride=require('method-override');
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
// const cors = require('cors');
const DATABASE_URL=process.env.DATABASE_URL;

const app = express();
const PORT = process.env.PORT || 3000;
// app.use(cors());
// app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
const client = new pg.Client(DATABASE_URL);
client.on('error', err => console.error(err));














client.connect.then(()=>app.listen(PORT,()=>console.log(`the PORT is:${PORT}`)))