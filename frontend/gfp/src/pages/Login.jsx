import React, { useState } from 'react';
import styles from '../styles/Estilos';
import logo from '../assets/logo.png';
import { enderecoServidor } from '../utils'
import { useNavigate } from 'react-router-dom';

// Import icons (using react-icons as an example)
// You might need to install it: npm instll react-icons
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdBarChart, MdNotifications, MdTrendingUp } from 'react-icons/md';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lembrar, setLembrar] = useState()

  const navigate = useNavigate();

  const botaoLogin = async (e) => {
    e.preventDefault();
    try {
      if (email === '' || senha === '') {
        throw new Error('Preencha todos os campos');
      }
      //autenticando utilizando a API de backend com o fetch e recebendo o token
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      const dados = await resposta.json();
      if (resposta.ok) {
        // Aqui você pode armazenar o token em um estado global ou AsyncStorage, se necessário
        localStorage.setItem('UsuarioLogado', JSON.stringify(...dados, lembrar));
        navigate("/principal")
      } else {
        throw new Error(dados.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert(error.message);
      return;
    }
  };
x
      useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await localStorage.getItem('UsuarioLogado');
            if (usuarioLogado){
                const usuario = JSON.parse(usuarioLogado);
                if (usuario.lembrar == true){
                    navigate('/principal')
                }
            }
        }
    },[])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Using MdTrendingUp as a placeholder for the logo */}

        <img src={logo} alt="Logo" className={styles.logoIcon} style={{ width: '50px', height: '50px' }} />
        <div>
          <h1 className={styles.appName}>GFP</h1>
          <p className={styles.appSubtitle}>Gestor Financeiro Pessoal</p>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.loginForm}>
          <h2 className={styles.title}>Acesse sua conta</h2>

          <div className={styles.inputGroup}>
            <MdEmail className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              aria-label="Email"
            />
          </div>

          <div className={styles.inputGroup}>
            <MdLock className={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={styles.input}
              aria-label="Senha"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.visibilityToggle}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>

          <div className={styles.between}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" style={{marginRight: '5px'}} 
              checked={lembrar} onChange={(e) => setLembrar(e.target.checked)}/>
              <label> Lembrar-me</label>
            </div>
            <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>

          </div>

          <button type="submit" className={styles.submitButton} onClick={botaoLogin}>
            Entrar
          </button>

          <p className={styles.signupText}>
            Não tem uma conta? <a href="#" className={styles.signupLink}>Cadastre-se</a>
          </p>
        </div>

        <div className={styles.infoBoxes}>
          <div className={styles.infoBox}>
            <MdBarChart className={styles.infoIcon} />
            <span>Acompanhe seus gastos com gráficos</span>
          </div>
          <div className={styles.infoBox}>
            <MdNotifications className={styles.infoIcon} />
            <span>Receba alertas financeiros importantes</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;