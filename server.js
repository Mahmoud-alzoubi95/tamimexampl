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

app.use(express.urlencoded({ extended: true }));
app.use(express.static( "./puplic"));

app.get('/home',renderhome)
app.post('/add',savechar)
app.get('/character/my-fav-characters',renderfav)
app.get('/detale-favorite-character/:id',renderDetailes)
app.delete('/character/:id',deletechar)
app.put('/character/:id',updatechar)
app.get('/creatpage',rendercreateform)
app.post('/create',createnewchar)



function createnewchar(req,res) {
    const{name,house,patronus,alive}=req.body
    const SQL='insert into characters(name,house,patronus,alive,created_by) values($1,$2,$3,$4,$5);'
    const safeVlaues=[name,house,patronus,alive,'user']
    client.query(SQL,safeVlaues).then(()=>{
        res.redirect('/character/my-fav-characters')
    })
}

function rendercreateform(req,res) {
    res.render('pages/create')
}

function updatechar(req,res) {
    const id=req.params.id;
    const {name,house,patronus,alive}=req.body
    const sql=`update characters set name=$1,house=$2,patronus=$3,alive=$4 where id=${id};`
    const safeVlaues=[name,house,patronus,alive]
    client.query(sql,safeVlaues).then(()=>{
        res.redirect(`/detale-favorite-character/${id}`);
    })
}


function deletechar(req,res) {
    const id=req.params.id;
    const sql=`delete from characters where id=${id};`
    client.query(sql).then(()=>{
        res.redirect('/character/my-fav-characters');
    })
}


function renderDetailes(req,res) {
    const id= req.params.id;
    const sql=`select * from characters where id=${id};`
    client.query(sql).then(data=>{
        res.render('pages/detail',{data:data.rows})
    })
    
}

function renderfav(req,res) {
    const sql='select * from characters;'
    client.query(sql).then(data=>{
        res.render('pages/fav',{favorite:data.rows})
    })  
}


function savechar(req,res) {
    const{name,house,patronus,alive}=req.body
    const SQL='insert into characters(name,house,patronus,alive,created_by) values($1,$2,$3,$4,$5);'
    const safeVlaues=[name,house,patronus,alive,'api']
    client.query(SQL,safeVlaues).then(()=>{
        res.redirect('/character/my-fav-characters')
    })
}

function Char(data){
    this.name=data.name;
    this.house=data.house;
    this.patronus=data.patronus;
    this.alive=data.alive
}


function renderhome(req,res) {
    const url='http://hp-api.herokuapp.com/api/characters';

    superagent.get(url).then(data=>{
        
      const allData= data.body.map(data=>{
           return new Char(data)
        })
        res.render('pages/index',{data:allData})
    })
}




client.connect().then(()=>app.listen(PORT,()=>console.log(`the PORT is:${PORT}`)))