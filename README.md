# ConectaPI — Frontend Mobile

Aplicativo mobile do ConectaPI, desenvolvido com React Native, Expo e TypeScript.

A aplicação oferece ferramentas para pequenos negócios organizarem produtos, clientes, vendas, encomendas, estoque e operações financeiras.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React Native | Desenvolvimento mobile |
| Expo | Plataforma de desenvolvimento |
| TypeScript | Tipagem estática |
| React Navigation | Navegação entre telas |
| Expo Secure Store | Armazenamento seguro do token |
| Expo Image Picker | Seleção de imagens |
| React Native SVG | Elementos gráficos |
| React Native Gifted Charts | Gráficos |
| Poppins | Tipografia |

Versões declaradas no projeto:

- Expo `~58.0.21`
- React `19.3.0`
- React Native `0.88.0`
- TypeScript `~6.0.3`

## Pré-requisitos

- Node.js compatível com a versão do Expo utilizada.
- npm.
- Expo Go ou emulador configurado.
- Backend do ConectaPI em execução.
- MySQL configurado no Backend.

## Instalação

Na raiz do repositório Front, execute:

```powershell
npm ci
```

O comando instala as dependências conforme o `package-lock.json`.

É necessário que o arquivo exista e esteja sincronizado com o `package.json`.

## Executar o aplicativo

Para iniciar o Expo:

```powershell
npm run start
```

Também estão disponíveis:

```powershell
npm run android
npm run ios
npm run web
```

### Script de inicialização

O projeto também disponibiliza:

```powershell
.\scripts\iniciar-front.ps1
```

Esse script auxilia na preparação e inicialização do Frontend no Windows.

## Integração com o Backend

O aplicativo se comunica com a API REST do ConectaPI, normalmente disponível na porta `8080`.

O cliente HTTP central está localizado em:

```text
src/services/api.ts
```

A URL utilizada segue o padrão:

```text
http://<host-detectado-do-Expo-ou-localhost>:8080/api
```

O host é obtido por meio das informações do Expo, com fallback para `localhost`.

Para utilizar o aplicativo em um dispositivo físico:

- O celular e o computador devem conseguir se comunicar pela rede.
- O Backend precisa estar em execução.
- A porta `8080` deve estar acessível.
- O firewall e as configurações CORS devem permitir a comunicação.

A configuração analisada utiliza HTTP sem TLS. Para implantação em produção, é necessário configurar transporte seguro.

## Autenticação

O aplicativo utiliza JWT para autenticação nas requisições protegidas.

- O token é armazenado com `expo-secure-store`.
- As requisições autenticadas enviam `Authorization: Bearer`.
- O cliente HTTP disponibiliza `apiGet`, `apiPost`, `apiPatch` e `apiDelete`.
- O timeout observado é de 15 segundos.
- Em respostas HTTP 401, o token é removido e o aplicativo informa a situação de sessão não autorizada ou expirada.

As chamadas de autenticação são realizadas sem envio do token pelo wrapper `apiPost`.

## Funcionalidades

### Acesso e conta
- Onboarding.
- Cadastro.
- Login.
- Recuperação de senha por código.

### Dashboard
- Visão geral do negócio.
- Indicadores e informações financeiras.

### Produtos e estoque
- Cadastro e edição de produtos.
- Detalhes dos produtos.
- Controle de estoque.
- Ficha técnica.
- Gerenciamento de imagens.

### Clientes e encomendas
- Cadastro e consulta de clientes.
- Criação e acompanhamento de encomendas.
- Consulta de detalhes e status.

### Vendas e cobranças
- Cobranças.
- Fluxos de pagamento via Pix, dinheiro e cartão.
- Consulta de pedidos e vendas.

### Gestão do negócio
- Financeiro.
- Fornecedores.
- Lista de compras.
- Relatórios.
- Perfil e configurações.

## Organização do projeto

```text
src/
├── @types/       # Declarações auxiliares TypeScript
├── assets/       # Imagens e recursos
├── components/   # Componentes reutilizáveis
├── contexts/     # Estados compartilhados
├── global/       # Tema e configurações visuais
├── hooks/        # Hooks personalizados
├── pages/        # Telas do aplicativo
├── routes/       # Navegação e tipos de rotas
├── services/     # Comunicação com a API
├── types/        # Tipos e interfaces
└── utils/        # Funções auxiliares
```

## Modelo de acesso e dados

O ConectaPI prevê um único proprietário por negócio.

- Somente o proprietário acessa o sistema.
- Não existem contas individuais para funcionários ou colaboradores.
- As credenciais não devem ser compartilhadas.
- Cada proprietário deve ter seus próprios dados.

O projeto mantém uma conta de demonstração preparada para apresentação. Novos proprietários devem começar sem registros fictícios e cadastrar suas próprias informações.

A conta e os dados de demonstração são mantidos no Backend e no banco de dados, não sendo criados pelo aplicativo mobile.

## Testes e validações

O `package.json` analisado não declara scripts próprios de teste, lint ou typecheck.

Para verificar os tipos TypeScript, utilize:

```powershell
npx tsc --noEmit
```

Esse comando verifica erros de tipagem sem gerar arquivos JavaScript.

## Boas práticas

- Não incluir senhas, tokens ou dados pessoais no código.
- Não compartilhar credenciais da conta de demonstração.
- Não utilizar a base de demonstração para testes destrutivos.
- Manter o isolamento dos dados por proprietário.
- Não depender exclusivamente da interface mobile para garantir autorização.
- Manter a comunicação com a API protegida nos ambientes de produção.

