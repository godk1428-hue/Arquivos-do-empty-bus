import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icone } from '../componentes/Icones';
import { useAutenticacao } from '../contextos/ContextoAuth';
import { useAviso } from '../contextos/ContextoAviso';

const readProfile = (u) => {
  try { return JSON.parse(localStorage.getItem(`painel:perfil:${u.id}`)) || {}; } catch { return {}; }
};
const writeProfile = (u, p) => {
  try { localStorage.setItem(`painel:perfil:${u.id}`, JSON.stringify(p)); return true; } catch { return false; }
};

/** Tela: Perfil (#/perfil) */
export default function Perfil() {
  const { user, updateName } = useAutenticacao();
  const toast = useAviso();
  const { state } = useLocation();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(() => readProfile(user));
  const [editing, setEditing] = useState(false);
  const [focusField, setFocusField] = useState('name');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [error, setError] = useState({ msg: '', field: null });

  useEffect(() => {
    if (editing) document.getElementById(`pf-${focusField}`)?.focus();
  }, [editing, focusField]);

  const startEdit = (field = 'name') => {
    setForm({ name: user.name, phone: profile.phone || '', address: profile.address || '' });
    setError({ msg: '', field: null });
    setFocusField(field);
    setEditing(true);
  };

  const fail = (msg, field) => {
    setError({ msg, field });
    if (field) document.getElementById(`pf-${field}`)?.focus();
  };

  const save = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();
    const digits = phone.replace(/\D/g, '');

    if (name.length < 2) return fail('Informe seu nome (mínimo 2 letras).', 'name');
    if (phone && (digits.length < 10 || digits.length > 11)) return fail('Telefone inválido. Use DDD + número.', 'phone');

    const result = updateName(name);
    if (!result.ok) return fail(result.error, 'name');
    const next = { ...profile, phone, address };
    if (!writeProfile(user, next)) return fail('Não foi possível salvar neste navegador.');

    setProfile(next);
    setEditing(false);
    toast('Perfil atualizado');
  };

  // Foto: reduzida para 256x256 e guardada no navegador
  const onPhoto = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const SIZE = 256;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SIZE;
      const side = Math.min(img.width, img.height);
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
      const next = { ...profile, photo: canvas.toDataURL('image/jpeg', 0.85) };
      if (writeProfile(user, next)) { setProfile(next); toast('Foto atualizada'); }
      else toast('Não foi possível salvar a foto.');
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast('Não foi possível ler a imagem.'); };
    img.src = url;
  };

  const InfoRow = ({ icon, title, value, onClick }) => (
    <button className="cf-row" type="button" onClick={onClick}>
      <span className="cf-ic"><Icone name={icon} /></span>
      <span className="cf-tx"><b>{title}</b><small>{value}</small></span>
      <Icone name="chev" />
    </button>
  );

  return (
    <main className="app-container cf">
      <header className="cf-hd">
        <Link className="cf-hb l" to={state?.from === 'config' ? '/config' : '/inicio'} aria-label="Voltar"><Icone name="back" /></Link>
        <h2>Perfil</h2>
      </header>
      <section className="cf-sheet">
        <div className="cf-who">
          <div className="cf-av">
            {profile.photo
              ? <img src={profile.photo} alt="Foto do perfil" />
              : <Icone name="user" />}
            <button type="button" className="cf-cam" aria-label="Alterar foto" onClick={() => fileRef.current.click()}><Icone name="cam" /></button>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={onPhoto} />
          </div>
          <div>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        {!editing ? (
          <div>
            <h3 className="cf-s">Minhas informações</h3>
            <div className="cf-grp">
              <InfoRow icon="user" title="Nome" value={user.name} onClick={() => startEdit('name')} />
              <InfoRow icon="mail" title="E-mail" value={user.email} onClick={() => toast('O e-mail da conta não pode ser alterado por aqui')} />
              <InfoRow icon="phone" title="Telefone" value={profile.phone || 'Adicionar telefone'} onClick={() => startEdit('phone')} />
            </div>

            <h3 className="cf-s">Preferências</h3>
            <div className="cf-grp">
              <Link className="cf-row" to="/linhas?filtro=fav">
                <span className="cf-ic"><Icone name="star" /></span>
                <span className="cf-tx"><b>Linhas favoritas</b><small>Gerencie suas linhas preferidas</small></span>
                <Icone name="chev" />
              </Link>
              <InfoRow icon="pin" title="Endereço padrão" value={profile.address || 'Defina um endereço padrão'} onClick={() => startEdit('address')} />
            </div>

            <button type="button" className="cf-wide" onClick={() => startEdit()}><Icone name="edit" /> Editar perfil</button>
          </div>
        ) : (
          <form className="cf-form" onSubmit={save} noValidate>
            <h3 className="cf-s">Editar perfil</h3>
            <div className="cf-field"><label htmlFor="pf-name">Nome</label>
              <input id="pf-name" type="text" autoComplete="name" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="cf-field"><label htmlFor="pf-email">E-mail</label>
              <input id="pf-email" type="email" value={user.email} disabled /></div>
            <div className="cf-field"><label htmlFor="pf-phone">Telefone</label>
              <input id="pf-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(81) 91234-5678" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="cf-field"><label htmlFor="pf-address">Endereço padrão</label>
              <input id="pf-address" type="text" autoComplete="street-address" placeholder="Rua, número, bairro" maxLength={120} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <small className="cf-err" role="alert">{error.msg}</small>
            <div className="cf-actions">
              <button type="button" className="cf-wide ghost" onClick={() => setEditing(false)}>Cancelar</button>
              <button type="submit" className="cf-wide solid">Salvar</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
