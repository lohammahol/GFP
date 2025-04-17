import { BD } from "../db.js";
import bcrypt from 'bcrypt'

class rotasUsuarios {
    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;

        const salRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, salRounds)
        try {
            const usuario = await BD.query(`
                INSERT INTO usuarios(nome, email, senha, tipo_acesso)
                VALUES($1, $2, $3, $4) 
                `, [nome, email, senhaCriptografada, tipo_acesso])
            res.status(201).json('Usuario Cadastrado')
        } catch (error) {
            console.error('Erro ao criar usuario', error);
            res.status(500).json({ message: 'Erro ao criar', error: error.message })

        }
    }
    // Rotas de login
    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            const resultado = await BD.query(
                `SELECT * FROM usuarios WHERE email = $1`,
                [email]
            );

            if (resultado.rows.length === 0) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }

            const usuario = resultado.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha)

            if (!senhaValida) {
                return res.status(401).json({ message: "Email ou senha inválidos" });
            }



            return res.status(200).json({ message: "Login bem-sucedido" });
            // return res.status(200).json({message: "Login bem-sucedido", usuario});

        } catch (error) {
            console.error("Erro ao logar:", error);
            res.status(500).json({ message: "Erro ao logar", error: error.message });
        }
    }

    // Rotas de leitura
    static async leituraUsuario(req, res) {
        try {
            const usuarios = await Usuario.leituraUsuario();
            return res.status(200).json(usuarios); //retorna a lista de usuarios
        } catch (error) {
            res.status(500).json({
                message:
                    'Erro ao listar os usuarios', error: error.message
            })
        }
    }
    // Rotas de atualização
    static async atualizarTodosUsuarios(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body

        try {
            const usuario = await BD.query('UPTADE usuarios SET nome = $1, email = $2, senha = $3 WHERE tipo_acesso = $4 RETURNING*',
                [nome, email, senha, tipo_acesso]);// comando SQL para atualizar o usuario
            res.status(200).json(usuario.rows)
        } catch (error) {
            res.status(500).json({
                message: "Erro ao consultar o usuario",
                error: error.message
            })
        }
    }
    // Rota de exclusão(Realizar desativação)
    static async excluirUsuario(req, res) {
        const { id } = req.params;
        try {
            const usuario = await BD.query(
                'UPDATE usuarios SET ativo = false id = $1', [id])
            return res.status(200).json({ message: "Usuario deletado com sucesso" })
        } catch (error) {
            res.status(500).json({
                message:
                    "Erro ao deletar usuario", error: error.message
            })
        }
    }
    static async atualizar(req, res) {
        const { id } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;

        try {
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizar
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`)// Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }
            if (email !== undefined) {
                campos.push(`email = $${valores.length + 1}`)
                valores.push(email);
            }
            if (senha !== undefined) {
                campos.push(`senha = $${valores.length + 1}`)
                valores.push(senha);
            }
            if (tipo_acesso !== undefined) {
                campos.push(`tipo_acesso = $${valores.length + 1}`)
                valores.push(tipo_acesso);
            }
            if (campos.length === 0) {
                return res.status(400).json({ message: "Nenhum campo fornecido para atualização" })
            }

            //montamos a query dinamicamente
            const query = `UPDATE proud_usuarios
                           SET ${campos.join(', ')}
                           WHERE id_usuario = ${id}
                           RETURNING *`;
            //executando nossa query
            const usuario = await BD.query(query, valores)

            //verifica se o usuario foi atualizado
            if (usuario.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }

            return res.status(200).json(usuario.rows[0]);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao atualizar o ususario", error: error.message })
        }
    }
}

export default rotasUsuarios;