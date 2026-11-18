# Empty-Bus – arquivos para colocar no seu projeto React

Tudo está em português (pastas, arquivos, componentes e funções).

## 1. Instale as dependências (na pasta do seu projeto)

```bash
npm install react-router-dom leaflet
```

## 2. Copie a pasta `src`

Copie o conteúdo da pasta `src/` deste pacote para a `src/` do seu projeto
(substituindo `App.jsx` e `main.jsx`).

> Se o seu projeto usa Create React App, o `main.jsx` equivale ao seu `index.js`:
> copie o conteúdo dele para lá e mantenha o `App.jsx`.

## 3. Ajuste o `index.html` do seu projeto

Dentro do `<head>`, adicione as fontes e os ícones:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 4. Rode

```bash
npm run dev      # Vite
# ou
npm start        # Create React App
```

## Estrutura

```
src/
├── App.jsx                  (rotas)
├── main.jsx                 (entrada)
├── paginas/                 (uma por tela)
│   ├── Entrar.jsx           login e cadastro
│   ├── Inicio.jsx           próximos ônibus
│   ├── Linhas.jsx           linhas de ônibus
│   ├── DetalheLinha.jsx     detalhe da linha e lotação
│   ├── Mapa.jsx             mapa
│   ├── Configuracoes.jsx    configurações
│   └── Perfil.jsx           perfil
├── componentes/             Icones, ItemOnibus, ListaOnibus, RotaProtegida
├── contextos/               ContextoAuth, ContextoAjustes, ContextoAviso, ContextoOnibus
├── ganchos/                 useArmazenamentoLocal
├── dados/                   onibus.js, paradas.js
├── servicos/                autenticacao.js
├── utilitarios/             formatar.js
└── estilos/                 base, inicio, autenticacao, mapa, linha, configuracoes
```
