import { BD } from "../db.js";
import bcrypt from 'bcrypt'

class rotasSubCategorias {
    static async novaSubCategoria(req, res){
        const { nome, id_categoria, gasto_fixo } = req.body;

        try{
            const subCategoria = await BD.query(`
                INSERT INTO subcategorias ( nome, id_categoria, gasto_fixo  )
                VALUES($1, $2, $3) 
                `,[ nome, id_categoria, gasto_fixo  ])
                res.status(201).json('subCategoria Cadastrado')
        }catch(error){
            console.error('Erro ao criar a subCategoria', error);
            res.status(500).json({message: 'Erro ao criar', error: error.message})
            
        }
    }

    static async leiturasubCategoria(req, res ){
        try{
            const subCategorias = await subCategorias.leituraCategoria();
           return res.status(200).json(subCategorias); //retorna a lista de categorias
        }catch(error){
            res.status(500).json({message:
                'Erro ao listar as subCategorias', error: error.message})
        }
    }

    static async atualizarTodassubCategorias(req, res ){
        const { id_subcategoria, nome, id_categoria, gasto_fixo, ativo  } = req.body
    
        try{
         const subCategorias = await BD.query('UPTADE subCategorias SET id_subCategoria = $1, nome = $2, id_categoria = $3, gasto_fixo = $4, WHERE ativo = $5 RETURNING*',
           [id_subcategoria, nome, id_categoria, gasto_fixo, ativo ]);// comando SQL para atualizar o usuario
        res.status(200).json(subCategorias.rows)
        }catch(error){
         res.status(500).json({message: "Erro ao consultar o usuario", 
           error: error.message})
        }
    }

    static async excluirsubCategorias(req, res){
        const { id_usuario } = req.params;
        try{
            const subcategorias = await BD.query(
                'UPDATE subCategorias SET ativo = false WHERE id_usuario = $1', [id_usuario])
            return res.status(200).json({message: "Categoria deletada com sucesso"})
        }catch(error){
            res.status(500).json({message: 
                "Erro ao deletar categoria", error: error.message})
        }
    }

    static async atualizar(req, res){
        const {id_usuario} = req.params;
        const { id_subcategoria, nome, id_categoria, gasto_fixo, ativo  } = req.body;

        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizar
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if(id_subcategoria !== undefined){
                campos.push(`id_subcategoria = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(id_subcategoria); 
            }
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(nome); 
            }
            if(id_categoria !== undefined){
                campos.push(`id_categoria = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(id_categoria); 
            }
            if(gasto_fixo !== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo); 
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo); 
            }
            if(campos.length === 0){
                return res.status(400).json({message: "Nenhum campo fornecido para atualização"})
            }

            //montamos a query dinamicamente
            const query = `UPDATE subcategorias
                           SET ${campos.join(', ')}
                           WHERE id_categorias = ${id_usuario}
                           RETURNING *`;
            //executando nossa query
            const subCategorias = await BD.query(query,valores)

            //verifica se o usuario foi atualizado
            if(subCategorias.rows.length === 0){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }

            return res.status(200).json(subCategorias.rows[0]);
        }
        catch(error){
            res.status(500).json({message: "Erro ao atualizar o ususario", error: error.message})
        }
    }
}

export default rotasSubCategorias;