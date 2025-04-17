import { BD } from "../db.js";
import bcrypt from 'bcrypt'

class rotaslocalTransacoes {
    static async novaTransacoes(req, res){
        const { nome, tipo_local, saldo, ativo } = req.body;

        try{
            const localTransacao = await BD.query(`
                INSERT INTO local_transacao (nome, tipo_local, saldo, ativo)
                VALUES($1, $2, $3, $4) 
                `,[nome, tipo_local, saldo, ativo])
                res.status(201).json('local transações Cadastrado')
        }catch(error){
            console.error('Erro ao criar local transações', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
            
        }
    }

    static async leituraLTransacao(req, res ){
        try{
            const localTransacao = await BD.query('SELECT * FROM local_transacao');
           return res.status(200).json(localTransacao.rows); 
        }catch(error){
            res.status(500).json({message:
                'Erro ao listar os local Transacao', error: error.message})
        }
    }

    static async atualizarTransacao(req, res ){
        const { id_localTransacoes  } = req.params;
        const { nome, tipo_local, saldo, ativo } = req.body
    
        try{
         const localTransacao = await BD.query('UPDATE local_transacao SET  nome = $1, tipo_local= $2, saldo = $3, ativo = $4 WHERE id_local_transacao = $5 RETURNING*',
           [ nome, tipo_local, saldo, ativo, id_localTransacoes]);
        res.status(200).json(localTransacao.rows)
        }catch(error){
         res.status(500).json({message: "Erro ao consultar o local transação", 
           error: error.message})
        }
    }

    static async excluirtransacao (req, res){
        const { id_localTransacoes  } = req.params;
        try{
            const localTransacao = await BD.query(
                'UPDATE local_transacao SET ativo = false WHERE id_local_transacao  = $1', [id_localTransacoes ])
            return res.status(200).json({message: "Local transação deletado com sucesso"})
        }catch(error){
            res.status(500).json({message: 
                "Erro ao deletar Local transação", error: error.message})
        }
    }

    static async atualizarTodasTransacao(req, res){
        const {id_localTransacoes } = req.params;
        const { nome, tipo_local, saldo, ativo } = req.body;

        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizar
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if(id_localTransacoes !== undefined){
                campos.push(`id_localTransacoes = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(id_localTransacoes); 
            }
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(nome); 
            }
            if(tipo_local !== undefined){
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local); 
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo); 
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo); 
            }
            if(campos.length === 0){
                return res.status(400).json({message: "Nenhum campo fornecido para atualização"})
            }

            //montamos a query dinamicamente
            const query = `UPDATE local_transacao
                           SET ${campos.join(', ')}
                           WHERE local_transacao = ${id_localTransacoes}
                           RETURNING *`;
            //executando nossa query
            const localTransacao  = await BD.query(query,valores)

            //verifica se o usuario foi atualizado
            if(localTransacao .rows.length === 0){
                return res.status(404).json({message: 'Local Transação não encontrado'})
            }

            return res.status(200).json(localTransacao .rows[0]);
        }
        catch(error){
            res.status(500).json({message: "Erro ao atualizar o Local Transação", error: error.message})
        }
    }
}
export default rotaslocalTransacoes;