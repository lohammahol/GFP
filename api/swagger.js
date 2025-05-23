import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'http://192.168.0.237:3000',
            description: 'Servidor de API do Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuarios',
            description: 'Rotas para cadastro, login, atualização e desativação de usuarios'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        }
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    paths: {
        '/usuarios': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuario',
                description: 'Método utilizado para cadastrar novos usuarios',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuario cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar usuario'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuarios',
                description: 'Método utilizado para listar todos os usuarios cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuarios',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security:[{
                    bearerAuth: [],
                }

            ],
            parameters:[
                {
                name: 'id_usuario',
                in: 'path', // caso queria passar como query in: 'query'
                required: true,
                schema: {
                    type: 'integer'
                }
            }
            ],
            responses: {
                '200':{ description: 'Usuario desativado com sucesso!'},
                '500': {description: 'Erro desativar usuario'}
            }

           }
        },
        '/usuarios/{id_usuario}':{
             delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security:[{
                    bearerAuth: [],
                }

            ],
            parameters:[
                {
                name: 'id_usuario',
                in: 'path', // caso queria passar como query in: 'query'
                required: true,
                schema: {
                    type: 'integer'
                }
            }
            ],
            responses: {
                '200':{ description: 'Usuario desativado com sucesso!'},
                '500': {description: 'Erro desativar usuario'}
            }

           }
        },
        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuario',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuario encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Erro ao encontrar usuario'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },

        },
        '/categorias': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova Categoria',
                description: 'Rota para cadastrar nova categoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: {type: 'string', example: 'Alimentação'},
                                    tipo_acesso: {type: 'string', example: 'ENTRADA OU SAIDA'},
                                    gasto_fixo: {type: 'boolean', example: true},
                                    id_usuario: {type: 'integer', example: 1},
                                    cor: {type: 'string', example: '#fff'},
                                    icone: {type: 'string', example: 'save'}
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Categoria cadastrada'
                    },
                    '400': {
                        description: 'Erro ao cadastrar categoria'
                    },
                    '500':{
                        description: 'Erro interno do servidor'
                    }
                }
            }

            
        },
        '/subcategorias': {
            post: {
                tags: ['subcategorias'],
                summary: 'Cadastrar nova subcategoria',
                description: 'Método utilizado para cadastrar novas subcategorias',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'id_categoria', 'gasto_fixo', 'ativo'],
                                properties: {
                                    nome: { type: 'string', example: 'africa twin' },
                                    id_categoria: { type: 'string', example: 2 },
                                    gasto_fixo: { type: 'string', example: true },
                                    ativo: { type: 'string', example: true }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Subcategoria cadastrada com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar subcategoria'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['subcategorias'],
                summary: 'Listar todas as subcategorias',
                description: 'Método utilizado para listar todas as subcategorias cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de subcategorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                           nome: { type: 'string', example: 'africa twin' },
                                    id_categoria: { type: 'string', example: 2 },
                                    gasto_fixo: { type: 'string', example: true },
                                    ativo: { type: 'boolean', example: true }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['subcategorias'],
                summary: 'Desativar subcategorias ',
                description: 'Rota para desativar subcategorias',
                security:[{
                    bearerAuth: [],
                }

            ],
            parameters:[
                {
                name: 'id_subcategorias',
                in: 'path', // caso queria passar como query in: 'query'
                required: true,
                schema: {
                    type: 'integer'
                }
            }
            ],
            responses: {
                '200':{ description: 'Subcategoria desativada com sucesso!'},
                '500': {description: 'Erro desativar subcategorias'}
            }

           }
        },
        '/transacao': {
            post: {
                tags: ['transacao'],
                summary: 'Cadastrar nova transacao',
                description: 'Método utilizado para cadastrar novas transacao',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['valor', 'descricao', 'data_transacao', 'data_vencimento', 'tipo_transacao', 'id_conta', 'id_categoria', 'id_subcategoria', 'id_usuario', 'num_parcelas', 'parcela_atual'],
                                properties: {
                                    valor: { type: 'string', example: '5000' },
                                    descricao: { type: 'string', example: 'teste' },
                                    data_transacao: { type: 'string', example: '12-09-2025' },
                                    data_vencimento: { type: 'string', example: '20-10-2025' },
                                    data_pagamento: { type: 'string', example: '10-10-2025' },
                                    tipo_transacao: {type: 'string', example: ENTRADA },
                                    id_conta: {type: 'string', example: NULL },
                                    id_categoria: {type: 'string', example: 2 },
                                    id_subcategoria: {type: 'string', example: 2 },
                                    id_usuario: {type: 'string', example: 1 },
                                    num_parcelas: {type: 'string', example: 1 },
                                    parcela_atual: {type: 'string', example: 2 },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'transacao cadastrada com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar transacao'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['transacao'],
                summary: 'Listar todas as transacao',
                description: 'Método utilizado para listar todas as transacao cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de transacao',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                    valor: { type: 'numeric', example: '5000' },
                                    descricao: { type: 'string', example: 'teste' },
                                    data_transacao: { type: 'string', example: '12-09-2025' },
                                    data_vencimento: { type: 'string', example: '20-10-2025' },
                                    data_pagamento: { type: 'string', example: '10-10-2025' },
                                    tipo_transacao: {type: 'string', example: ENTRADA },
                                    id_conta: {type: 'string', example: NULL },
                                    id_categoria: {type: 'string', example: 2 },
                                    id_subcategoria: {type: 'string', example: 2 },
                                    id_usuario: {type: 'string', example: 1 },
                                    num_parcelas: {type: 'string', example: 1 },
                                    parcela_atual: {type: 'string', example: 2 },
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            delete: {
                tags: ['transacao'],
                summary: 'Desativar transacao ',
                description: 'Rota para desativar transacao',
                security:[{
                    bearerAuth: [],
                }

            ],
            parameters:[
                {
                name: 'id_transacao',
                in: 'path', // caso queria passar como query in: 'query'
                required: true,
                schema: {
                    type: 'integer'
                }
            }
            ],
            responses: {
                '200':{ description: 'transacao desativada com sucesso!'},
                '500': {description: 'Erro desativar transacao'}
            }

           }
        },
        '/usuarios/{id_usuario}':{
             delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security:[{
                    bearerAuth: [],
                }

            ],
            parameters:[
                {
                name: 'id_usuario',
                in: 'path', // caso queria passar como query in: 'query'
                required: true,
                schema: {
                    type: 'integer'
                }
            }
            ],
            responses: {
                '200':{ description: 'Usuario desativado com sucesso!'},
                '500': {description: 'Erro desativar usuario'}
            }

           }
        }
    }
}
}

const options = {
    swaggerDefinition,
    apis: [] //
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec