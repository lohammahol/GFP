import { BD } from "../db.js"
import bcrypt from 'bcrypt'


class rotasTransacao {
    static async novaTransacao(req, res){
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_contas, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try{
            const localTransacao = await BD.query(`
                INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                `,[valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_contas, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual])
                res.status(201).json('Transações Cadastrado')
        }catch(error){
            console.error('Erro ao criar transações', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
            
        }
    }
    static async atualizar(req, res) {
        const { id_transacao } = req.params;
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_contas, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try {
            const transacao = await BD.query('UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4, data_pagamento = $5, tipo_transacao = $6, id_contas = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *', [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_contas, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual, id_transacao]);
            res.status(200).json(transacao.rows[0]);
        } catch(error) {
            console.error('Erro ao atualizar transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }
    }
    static async leituraTransacao (req, res) {
        try {
            const transacoes = await BD.query('SELECT * FROM transacoes');
            res.status(200).json(transacoes.rows);
        } catch(error) {
            console.error('Erro ao listar transações', error);
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
        }
    }
    static async excluirtransacao (req, res) {
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query('DELETE FROM transacoes WHERE id_transacao = $1 RETURNING *', [id_transacao]);
            return res.status(200).json({ message: 'Transação deletada com sucesso', transacao: transacao.rows[0] });
        } catch(error) {
            console.error('Erro ao deletar transação', error);
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
        }
    }
    static async listarPorID(req, res) {
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query('SELECT * FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            if(transacao.rows.length === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            res.status(200).json(transacao.rows[0]);
        } catch(error) {
            console.error('Erro ao listar transação', error);
            res.status(500).json({ message: 'Erro ao listar transação', error: error.message });
        }
    }

    //Criar uma rota que permite filtrar transações por data de vencimento ou data de pagamento dentro de um intervalo específico 
    static async filtrarPorData(req, res){
      const { data_inicio, data_fim, tipo_data } = req.query;
      
      let colunaData;
      if(tipo_data == 'vencimento'){
        colunaData = 'data_vencimento'
      }else if(tipo_data == 'pagamento'){
        colunaData = 'data_pagamento'
      }else{
        return res.status(400).json({
            message: 'Tipo_data inválido, use vencimento ou pagamento'
        })
      }
      try{
        const query = `
                SELECT t.*, u.nome AS nome_usuario, ct.nome 
                FROM transacoes AS t
                LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario
                JOIN contas ct ON t.id_conta = ct.id_conta
                WHERE ${colunaData} BETWEEN $1 AND $2
                ORDER BY ${colunaData} ASC 
            `

            const transacoes = await BD.query(query, [data_inicio, data_fim])

            res.status(200).json(transacoes.rows);
      }catch(error){
        console.log('Erro ao filtrar transação', error);
        res.status(500).json({ message: 'Erro ao filtrar transação', error: error.message })
        
      }
    }

    //somando transações entrada ou saida 

    static async somarTransacoes(req, res){
        const { tipo, id_usuario } = req.query;
        try{
            const tipoTransacao = tipo.toUpperCase();

            const query = `
                SELECT SUM(valor) AS total 
                FROM transacoes
                WHERE tipo_transacao = $1 AND id_usuario = $2 
            `
            const resultado = await BD.query(query, [tipoTransacao, id_usuario])

            let total = resultado.rows[0].total
            if(total == null)
            {
                total = 0 
            }
            res.status(200).json({total: parseFloat(total)});
        }catch(error){
            console.log('Erro ao filtrar transação', error);
        res.status(500).json({ message: 'Erro ao filtrar transação', error: error.message })
            
        }
    }

    static async transacoesVencidas(req, res){
        const { id_usuario } = req.params;

        try{
            const query = `
                SELECT t.valor, t.data_transacao, t.data_vencimento, t.data_pagamento,
                u.nome AS nome_usuario, 
                c.nome AS nome_conta,
                ct.nome AS nome_categoria,
                sct.nome AS nome_subcategoria
                FROM transacoes AS t 
                LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
                LEFT JOIN contas c ON t.id_conta = c.id_conta
                LEFT JOIN categorias ct ON t.id_categoria = ct.id_categoria
                LEFT JOIN subcategorias sct ON t.id_subcategoria = sct.id_subcategoria
                WHERE t.data_vencimento < CURRENT_DATE  --filtra transacoes vencidas
                AND t.id_usuario = $1
                ORDER BY t.data_vencimento ASC
            `

            const resultado = await BD.query(query, [id_usuario])

            const formatarDataBr = (data) => {
                if(!data) return null;
                return new Date(data).toLocalDateString('pt-BR')//Converte a data no padrao BR 
            }

            const dadosFormatados = resultado.rows.map(t => ({
                ...t, //copia todas as propriedades originais da resultado para a t 
                data_transacao: formatarDataBr(t.data_transacao),
                data_vencimento: formatarDataBr(t.data_vencimento),
                data_pagamento: formatarDataBr(t.data_pagamento),
            }))
            res.status(200).json(dadosFormatados)

        }catch(error){
            console.error('Erro ao buscar transações vencidas:', error);
            res.status(500).json({message: 'Erro ao listar transações vencidas', error: error.message})
            
        }
    }
    
}
export default rotasTransacao ;