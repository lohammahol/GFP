import { BD } from "../db.js";
import bcrypt from 'bcrypt'

class rotasConta {
    static async novaTransacoes(req, res){
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;

        try{
            const localConta = await BD.query(`
                INSERT INTO contas (nome, tipo_conta, saldo, ativo, conta_padrao)
                VALUES($1, $2, $3, $4, $5) 
                `,[nome, tipo_conta, saldo, ativo, conta_padrao])
                res.status(201).json('contas Cadastrada')
        }catch(error){
            console.error('Erro ao criar conta', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
            
        }
    }

    static async leituraLConta(req, res ){
        try{
            const contas = await BD.query('SELECT * FROM contas where ativo = true');
           return res.status(200).json(contas.rows); 
        }catch(error){
            res.status(500).json({message:
                'Erro ao listar os contas', error: error.message})
        }
    }

    static async atualizarConta(req, res ){
        const { id_conta  } = req.params;
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body
    
        try{
         const conta = await BD.query('UPDATE contas SET  nome = $1, tipo_conta = $2, saldo = $3, ativo = $4, conta_padrao = $5 WHERE id_conta = $6 RETURNING*',
           [ nome, tipo_conta, saldo, ativo, conta_padrao, id_conta]);
        res.status(200).json(conta.rows)
        }catch(error){
         res.status(500).json({message: "Erro ao consultar o contas", 
           error: error.message})
        }
    }

    static async excluirconta (req, res){
        const { id_conta } = req.params;
        try{
            const conta = await BD.query(
                'UPDATE contas SET ativo = false WHERE id_conta = $1', [id_conta])
            return res.status(200).json({message: "Conta transação deletado com sucesso"})
        }catch(error){
            res.status(500).json({message: 
                "Erro ao deletar Conta", error: error.message})
        }
    }

    static async atualizarTodasConta(req, res){
        const {id_conta } = req.params;
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;

        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizar
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if(id_conta !== undefined){
                campos.push(`id_conta = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(id_conta); 
            }
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(nome); 
            }
            if(tipo_conta !== undefined){
                campos.push(`tipo_conta = $${valores.length + 1}`)
                valores.push(tipo_conta); 
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo); 
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo); 
            }
            if(conta_padrao !== undefined){
                campos.push(`conta_padrao = $${valores.length + 1}`)
                valores.push(conta_padrao); 
            }
            if(campos.length === 0){
                return res.status(400).json({message: "Nenhum campo fornecido para atualização"})
            }

            //montamos a query dinamicamente
            const query = `UPDATE conta
                           SET ${campos.join(', ')}
                           WHERE conta = ${id_conta}
                           RETURNING *`;
            //executando nossa query
            const localconta  = await BD.query(query,valores)

            //verifica se o usuario foi atualizado
            if(localconta .rows.length === 0){
                return res.status(404).json({message: 'Conta não encontrada'})
            }

            return res.status(200).json(localconta .rows[0]);
        }
        catch(error){
            res.status(500).json({message: "Erro ao atualizar o Conta", error: error.message})
        }
    }
    static async filtrarNome(req, res){
        const { nome } = req.query;
        try{
            const query = `
            SELECT * FROM contas
            WHERE nome LIKE $1 AND ativo = true
            ORDER BY nome DESC
            `
            const valores = [`%${nome}%`]
            const resposta = await BD.query(query, valores)
            return res.status(200).json(resposta.rows)
        }catch(error){
            console.error('Erro ao filtrar categoria', error);
            res.status(500).json({message: "Erro ao filtrar categoria", error: error.message})
        }
    }
}
export default rotasConta;