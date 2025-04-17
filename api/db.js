import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config()

//Conexão com o supabase usando connectionString
// const BD = new Pool({
//   ConnectionString: "postgres://postgres.hqrugtyokndjklwpdqqt:zEBYNdgK5yWliUWw@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require",
//   ssl: {
//     rejectUnauthorizad: false //O Supabase requer SSL
//   }
// })

const BD = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bd_gfp',
    password: 'admin',
    port: 5432,
})

const testarConexao = async () => {
    try{
        
      const client = await BD.connect();//tenta estabelecer a conexao com banco 
      console.log("✔ conexao com o banco de dados estabelecida");
      client.release(); // libera o client
        
    }catch(error)
    {
      console.log("Erro ao conectar ao banco de dados", error.message);
        
    }
}

export  {BD, testarConexao};