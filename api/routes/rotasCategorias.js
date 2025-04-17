import { BD } from "../db.js";
import bcrypt from 'bcrypt'

class rotasCategorias {
    static async novaCategorias(req, res){
        const { id_categoria, nome, tipo_transacao, gasto_fixo, ativo, id_Usuario } = req.body;

        try{
            const categorias = await BD.query(`
                INSERT INTO categorias (id_categoria, nome, tipo_transacao, gasto_fixo, ativo, id_Usuario)
                VALUES($1, $2, $3, $4, $5, $6) 
                `,[id_categoria, nome, tipo_transacao, gasto_fixo, ativo, id_Usuario])
                res.status(201).json('Categoria Cadastrado')
        }catch(error){
            console.error('Erro ao criar Categoria', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
            
        }
    }

    static async leituraCategoria(req, res ){
        try{
            const categorias = await categorias.leituraCategoria();
           return res.status(200).json(categorias); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message:
                'Erro ao listar os categorias', error: error.message})
        }
    }

    static async atualizarTodasCategorias(req, res ){
        const {id_categoria} = req.params
        const { nome, tipo_transacao, gasto_fixo, ativo, id_Usuario } = req.body
    
        try{
         const usuario = await BD.query('UPDATE categorias SET nome = $2, tipo_transacao = $3, gasto_fixo = $4, ativo = $5 WHERE id_categoria = $6 RETURNING*',
           [id_categoria, nome, tipo_transacao, gasto_fixo, ativo, id_Usuario]);// comando SQL para atualizar o usuario
        res.status(200).json(usuario.rows)
        }catch(error){
         res.status(500).json({message: "Erro ao consultar o usuario", 
           error: error.message})
        }
    }

    static async excluirCategorias(req, res){
        const { id_usuario } = req.params;
        try{
            const categorias = await BD.query(
                'UPDATE categorias SET ativo = false WHERE id_usuario = $1', [id_usuario])
            return res.status(200).json({message: "Categoria deletada com sucesso"})
        }catch(error){
            res.status(500).json({message: 
                "Erro ao deletar categoria", error: error.message})
        }
    }

    static async atualizar(req, res){
        const {id_usuario} = req.params;
        const { id_categoria, nome, tipo_transacao, gasto_fixo, ativo, id_Usuario } = req.body;

        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizar
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if(id_categoria !== undefined){
                campos.push(`id_categoria = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(id_categoria); 
            }
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(nome); 
            }
            if(tipo_transacao !== undefined){
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao); 
            }
            if(gasto_fixo !== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo); 
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo); 
            }
            if(id_Usuario !== undefined){
                campos.push(`id_Usuario = $${valores.length + 1}`)
                valores.push(id_Usuario); 
            }
            if(campos.length === 0){
                return res.status(400).json({message: "Nenhum campo fornecido para atualização"})
            }

            //montamos a query dinamicamente
            const query = `UPDATE categorias
                           SET ${campos.join(', ')}
                           WHERE id_categoria = ${id_usuario}
                           RETURNING *`;
            //executando nossa query
            const categorias = await BD.query(query,valores)

            //verifica se o usuario foi atualizado
            if(categorias.rows.length === 0){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }

            return res.status(200).json(categorias.rows[0]);
        }
        catch(error){
            res.status(500).json({message: "Erro ao atualizar o ususario", error: error.message})
        }
    }

}

export default rotasCategorias;