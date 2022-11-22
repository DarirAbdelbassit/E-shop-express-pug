const express=require('express')
const bodyParser = require('body-parser'); 
const fs  = require('fs')
const http = require('http');
const path = require('path')
const app=express()
app.use(express.static(path.join(__dirname,'/views')));
app.set('view engine','pug')
app.use(express.static(__dirname +'/public'));
app.engine('pug', require('pug').__express)
app.use(express.static('public'));
const port = 3030; 
const host = "localhost";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
let users = JSON.parse(require('fs').readFileSync("./users.json"))
let user = null;
let total =0;
const products = JSON.parse(fs.readFileSync("./produit.json","utf-8"));
let MyCard = [];
let detail ;
app.get("/",(req,res)=>{
  res.render('index', {products: products,MyCard:MyCard,total:calculate()})
}) 
app.get("/index",(req,res)=>{
  res.redirect('/')
}) 
app.get("/login",(req,res)=>{
  res.render('login')
}) 
app.post("/loginCheck",(req,res)=>{
    user = users.find(u => u.username == req.body.username && u.password == req.body.password)
    if(user)
      res.redirect("/add")
    else
      res.redirect("/login")
})
app.post('/addProduct',(req,res)=>{
      let marque = req.body.marque
      let model = req.body.model 
      let prix  = req.body.prix 
      let desc = req.body.description
      let imag = req.body.image
      products.push(
        {
        "id": Math.max(...products.map(e => e.id))+1,
        "marque": ""+marque,
        "model": ""+model,
        "prix": prix+"$",
        "image": ""+imag,
        "description": ""+desc
        })
    fs.writeFile("produit.json", JSON.stringify(products), (err) => {
        if (err)
          console.log(err);
        else
          res.redirect('/add')
        }); 
    
})
app.get('/add', (req, res) => {
  if(user){
    if(user.role == 'Admin')
    res.render('add', {user});
    else
    res.send('<script>alert("your not an admin!!");window.history.go(-1);</script>')
  }
  else
  res.render('login')
})
app.get('/addToCard/:id',(req,res)=>{
      let id = req.params.id
      let myCardP = products.find(e=>e.id==id)
      if(myCardP && !MyCard.includes(myCardP)){
      MyCard.push(myCardP);}
      else
      res.send('<script>alert("le produit est déja ajouter");window.history.go(-1);</script>')
      res.redirect('/index')
})
app.get('/suppCard/:id',(req,res)=>{   
    MyCard.splice(MyCard.findIndex(p => p.id == req.params.id),1);
    res.redirect('/');
})
app.get('/info/:id',(req,res)=>{
  detail = products.find(e=>e.id == req.params.id );
  console.log(detail);
  res.render('product',{detail})
})
const calculate = () => {
  total=0;
  MyCard.forEach(p => {
    total+= +p.prix
  })
  return total;
}
app.use((req,res)=>{
  res.status(404)
  res.send("<h1>Page Not Found!</h1>")
})
app.listen(port, host, (req, res) => {
    console.log(`http://${host}:${port}`);
});