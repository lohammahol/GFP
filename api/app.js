import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotaslocalTransacoes from './routes/rotasLocalTransacoes.js';

const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('API funcionando!')
})

//Rotas usuarios
app.post('/usuario ', rotasUsuarios.novoUsuario)
app.post('/usuario/login', rotasUsuarios.login)
app.get('/usuarios/:id', rotasUsuarios.leituraUsuario)
// app.get('/categorias', rotasCategorias.listarUsuarioPorID)
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodosUsuarios)
app.delete('/usuario/:id_usuario', rotasUsuarios.excluirUsuario)


//Rotas de categorias
app.post('/categorias', rotasCategorias.novaCategorias)
app.get('/categorias', rotasCategorias.leituraCategoria)
// app.get('/categorias', rotasCategorias.listarCategoriasPorID)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)
app.put('/categorias', rotasCategorias.atualizarTodasCategorias)
app.delete('/categorias', rotasCategorias.excluirCategorias)


//Rotas de subcategorias
app.post('/subcategorias', rotasSubCategorias.novaSubCategoria)
app.get('/subcategorias', rotasSubCategorias.leiturasubCategoria)
// app.get('/subCategorias/:id_subcategorias', rotasSubCategorias.listarSubCategoriasPorID)
app.patch('/subcategorias/:id_subcategorias', rotasSubCategorias.atualizar)
app.put('/subcategorias/:id_subcategorias', rotasSubCategorias.atualizarTodassubCategorias)
app.delete('/subcategorias/:id_subcategorias', rotasSubCategorias.excluirsubCategorias)


// //Rotas Transacoes
// app.post('/transacao', rotasTransacao.novaTransacao)
// app.get('/transacao/', rotasTransacao.leituraTransacao)
// app.get('/transacao/:id_transacao', rotasTransacao.listarTransacaoPorID)
// app.patch('/transacao/:id_transacao', rotasTransacao.atualizar)
// app.put('/transacao/:id_transacao', rotasTransacao.atualizarTodasTransacao)
// app.delete('/transacao/:id_transacao', rotasTransacao.excluirtransacao)


//Rotas local Transacao
app.post('/localTransacao/', rotaslocalTransacoes.novaTransacoes)
app.get('/localTransacao/', rotaslocalTransacoes.leituraLTransacao)
// app.get('/localTransacao/:id_localTransacoes', rotaslocalTransacoes.listarTransacaoPorID)
app.patch('/localTransacao/:id_localTransacoes', rotaslocalTransacoes.atualizarTransacao)
app.put('/localTransacao/:id_localTransacoes', rotaslocalTransacoes.atualizarTodasTransacao)
app.delete('/localTransacao/:id_localTransacoes', rotaslocalTransacoes.excluirtransacao)

const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
    
})