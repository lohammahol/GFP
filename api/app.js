import express from 'express'
import { testarConexao } from './db.js'
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotasConta from './routes/rotasContas.js';
import rotasTransacao from './routes/rotasTransacoes.js';
const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('API funcionando!')
})

//Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.post('/usuarios/login', rotasUsuarios.login)
app.get('/usuarios/',autenticarToken, rotasUsuarios.leituraUsuario)
// app.get('/categorias', rotasCategorias.listarUsuarioPorID)
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar)
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodosUsuarios)
app.delete('/usuarios/:id_usuario',autenticarToken, rotasUsuarios.excluirUsuario)


//Rotas de categorias
app.post('/categorias', autenticarToken, rotasCategorias.novaCategorias)
app.get('/categorias/filtrarCategoria', rotasCategorias.filtrarCategoria)
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
app.post('/transacao', rotasTransacao.novaTransacao)
app.get('/transacao/somarTransacoes', rotasTransacao.somarTransacoes)
app.get('/transacao/filtrarPorData', rotasTransacao.filtrarPorData)
app.get('/transacao/transacoesVencidas/:id_usuario', rotasTransacao.transacoesVencidas)
// app.get('/transacao/', rotasTransacao.leituraTransacao)
// app.get('/transacao/:id_transacao', rotasTransacao.listarTransacaoPorID)
// app.patch('/transacao/:id_transacao', rotasTransacao.atualizar)
// app.put('/transacao/:id_transacao', rotasTransacao.atualizarTodasTransacao)
// app.delete('/transacao/:id_transacao', rotasTransacao.excluirtransacao)


//Rotas contas
app.post('/contas', rotasConta.novaTransacoes)
app.get('/contas', rotasConta.leituraLConta)
// app.get('/contas/:id_localTransacoes', rotaslocalTransacoes.listarTransacaoPorID)
app.patch('/contas/:id_conta', rotasConta.atualizarConta)
app.put('/contas/:id_conta', rotasConta.atualizarTodasConta)
app.delete('/contas/:id_conta', rotasConta.excluirconta)

const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
    
})