import { Link } from 'react-router-dom';
import { Icone } from '../componentes/Icones';
import { useAutenticacao } from '../contextos/ContextoAuth';
import { useAjustes } from '../contextos/ContextoAjustes';
import { useAviso } from '../contextos/ContextoAviso';

function ToastRow({ icon, title, subtitle, message }) {
  const toast = useAviso();
  return (
    <button className="cf-row" type="button" onClick={() => toast(message)}>
      <span className="cf-ic"><Icone name={icon} /></span>
      <span className="cf-tx"><b>{title}</b><small>{subtitle}</small></span>
      <Icone name="chev" />
    </button>
  );
}

function SwitchRow({ icon, title, subtitle, checked, onChange }) {
  return (
    <label className="cf-row">
      <span className="cf-ic"><Icone name={icon} /></span>
      <span className="cf-tx"><b>{title}</b><small>{subtitle}</small></span>
      <input type="checkbox" className="cf-sw" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

/** Tela: Configurações (#/config) */
export default function Configuracoes() {
  const { logout } = useAutenticacao();
  const { dark, setDark, locationOn, setLocationOn } = useAjustes();
  const toast = useAviso();

  return (
    <main className="app-container cf">
      <header className="cf-hd">
        <Link className="cf-hb l" to="/inicio" aria-label="Voltar"><Icone name="back" /></Link>
        <h2>Configurações</h2>
      </header>
      <section className="cf-sheet">
        <h3 className="cf-s">Conta</h3>
        <div className="cf-grp">
          <Link className="cf-row" to="/perfil" state={{ from: 'config' }}>
            <span className="cf-ic"><Icone name="user" /></span>
            <span className="cf-tx"><b>Perfil</b><small>Veja e edite suas informações</small></span>
            <Icone name="chev" />
          </Link>
          <ToastRow icon="lock" title="Privacidade" subtitle="Gerencie seus dados" message="Privacidade: em breve" />
        </div>

        <h3 className="cf-s">Aplicativo</h3>
        <div className="cf-grp">
          <SwitchRow icon="pal" title="Modo escuro" subtitle="Altere o tema do app" checked={dark} onChange={setDark} />
          <ToastRow icon="globe" title="Idioma" subtitle="Português (BR)" message="Por enquanto o app está disponível apenas em Português (BR)" />
          <SwitchRow icon="pin" title="Localização" subtitle="Permita o acesso ao seu local" checked={locationOn}
            onChange={(on) => { setLocationOn(on); toast(on ? 'Localização ativada' : 'Localização desativada'); }} />
        </div>

        <h3 className="cf-s">Suporte</h3>
        <div className="cf-grp">
          <ToastRow icon="help" title="Ajuda" subtitle="Tire suas dúvidas" message="Ajuda: em breve" />
          <ToastRow icon="chat" title="Fale conosco" subtitle="Envie sua mensagem" message="Fale conosco: em breve" />
          <ToastRow icon="info" title="Sobre o app" subtitle="Versão 1.0.0" message="Empty-Bus - versão 1.0.0" />
        </div>

        <button type="button" className="cf-wide" onClick={logout}><Icone name="out" /> Sair da conta</button>
      </section>
    </main>
  );
}
