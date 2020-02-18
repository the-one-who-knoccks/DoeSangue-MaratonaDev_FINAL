// Configurando o servidor
const express = require("express");
const server = express();

// Vonfigurar o servidor para aprensentar arquivos estáticos
server.use(express.static('public')); // Middlewares - Meio do caminho


// Habilitar body do formulário (corpo)
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados

const Pool = require('pg').Pool // Pool mantem a conexão ativa
//  NEW = novo objeto
const db = new Pool({  
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: 5435,
  database: 'doe'
});

// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true, // Valores booelandos. True ou False
})



// Configurar a apresentação da pagina
server.get("/", function(req, res) {
  db.query("SELECT * FROM donors", function(err, result){
    if (err) return res.send("Erro de banco de dados.")

    const donors = result.rows; 

    return res.render("index.html", { donors });
  })

});

server.post("/", function(req, res) {
   // Pegar dados do formulário
   const name = req.body.name
   const email = req.body.email
   const blood = req.body.blood

   // Se o name igual ou o email igual ou o blood igual a vazio
   if ( name == "" || email == "" || blood == "") {
     return res.send("Todos os campos são obrigatórios!");
   }

  // Colocar valores dentro do banco de dados
  const query = `
  INSERT INTO donors ("name", "email", "blood") 
  VALUES ($1, $2, $3)`
  
  const values = [name, email, blood]
  
  //Fluxo de erro
  db.query(query, values, function(err) {
    if (err) return res.send("erro no banco de dados")

    // Fluxo ideal
    return res.redirect("/");
  });

});

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
  console.log("Servidor iniciado!");
});

