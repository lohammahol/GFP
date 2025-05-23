import { useNavigate } from 'react-router-dom'
import React, {useState, useEffect} from 'react'  

export default function Principal () {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const buscarUsuario = async () => {
            const usuarioLogado = await localStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            }
        };

        buscarUsuario();
    }, [])

    const botaoLogout = () => {
        try{
            localStorage.removeItem('UsuarioLogado');
            navigate('/');
        } catch (error) {
            console.error('Erro ao deslogar:', error);
        }
    }

    return(
        <div>
            <div style={{display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
            <p>Usuario: {usuario.nome}</p>
            <button onClick={botaoLogout}>Sair</button>
        <div style={{padding: '20px'}}>
                <h2>Principal</h2>
        </div>
           
        </div>
 </div>

    )

   
}