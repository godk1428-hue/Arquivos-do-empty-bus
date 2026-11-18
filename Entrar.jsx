import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '../contextos/ContextoAuth';

const supportsCrypto = !!(window.crypto && crypto.subtle && crypto.randomUUID);

function PasswordInput({ id, name, value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrap">
      <input type={show ? 'text' : 'password'} id={id} name={name} value={value} onChange={onChange}
        autoComplete={autoComplete} placeholder={placeholder} required />
      <button type="button" className="toggle-pass" aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        onClick={() => setShow((s) => !s)}>
        <i className={show ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
      </button>
    </div>
  );
}

function Field({ label, id, error, children }) {
  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <small className="error">{error}</small>
    </div>
  );
}

function FormularioEntrar({ initialEmail }) {
  const { login } = useAutenticacao();
  const [form, setForm] = useState({ email: initialEmail, password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await login(form);
      if (!result.ok) setErrors(result.errors);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Ocorreu um erro inesperado. Tente novamente.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-form" role="tabpanel" onSubmit={submit} noValidate>
      <Field label="E-mail" id="login-email" error={errors.email}>
        <input type="email" id="login-email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="voce@email.com" required />
      </Field>
      <Field label="Senha" id="login-password" error={errors.password}>
        <PasswordInput id="login-password" name="password" value={form.password} onChange={set('password')} autoComplete="current-password" placeholder="Sua senha" />
      </Field>
      <label className="remember">
        <input type="checkbox" checked={form.remember} onChange={set('remember')} /> Manter conectado
      </label>
      <small className="error form-error">{errors.form}</small>
      <button type="submit" className="submit-btn" disabled={busy}>{busy ? 'Aguarde...' : 'Entrar'}</button>
    </form>
  );
}

function FormularioCadastro({ onCreated }) {
  const { register } = useAutenticacao();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await register(form);
      if (!result.ok) return setErrors(result.errors);
      onCreated(form.email.trim());
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Ocorreu um erro inesperado. Tente novamente.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="auth-form" role="tabpanel" onSubmit={submit} noValidate>
      <Field label="Nome" id="reg-name" error={errors.name}>
        <input type="text" id="reg-name" value={form.name} onChange={set('name')} autoComplete="name" placeholder="Seu nome" required />
      </Field>
      <Field label="E-mail" id="reg-email" error={errors.email}>
        <input type="email" id="reg-email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="voce@email.com" required />
      </Field>
      <Field label="Senha" id="reg-password" error={errors.password}>
        <PasswordInput id="reg-password" name="password" value={form.password} onChange={set('password')} autoComplete="new-password" placeholder="Mínimo 8 caracteres, letras e números" />
      </Field>
      <Field label="Confirmar senha" id="reg-confirm" error={errors.confirm}>
        <input type="password" id="reg-confirm" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" placeholder="Repita a senha" required />
      </Field>
      <small className="error form-error">{errors.form}</small>
      <button type="submit" className="submit-btn" disabled={busy}>{busy ? 'Aguarde...' : 'Criar conta'}</button>
    </form>
  );
}

export default function Entrar() {
  const { user } = useAutenticacao();
  const [tab, setTab] = useState('login');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  if (user) return <Navigate to="/inicio" replace />;

  return (
    <main className="app-container auth-screen">
      <header className="auth-header">
        <div className="auth-logo"><i className="fa-solid fa-bus" /></div>
        <h1>Empty-Bus</h1>
        <p>Acompanhe suas linhas em tempo real</p>
      </header>

      <div className="auth-card">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" className={`tab${tab === 'login' ? ' active' : ''}`}
            aria-selected={tab === 'login'} onClick={() => setTab('login')}>Entrar</button>
          <button type="button" role="tab" className={`tab${tab === 'register' ? ' active' : ''}`}
            aria-selected={tab === 'register'} onClick={() => { setTab('register'); setMessage(''); }}>Cadastrar</button>
        </div>

        {!supportsCrypto && (
          <p className="auth-message" style={{ background: '#FDECEA', color: '#B3261E' }} role="status">
            Este navegador/contexto não suporta criptografia. Abra a página via localhost ou HTTPS.
          </p>
        )}
        {message && <p className="auth-message" role="status" aria-live="polite">{message}</p>}

        {tab === 'login'
          ? <FormularioEntrar initialEmail={email} />
          : <FormularioCadastro onCreated={(mail) => {
              setEmail(mail);
              setTab('login');
              setMessage('Conta criada com sucesso! Entre com seu e-mail e senha.');
            }} />}
      </div>
    </main>
  );
}
