# Conecta Doces & Naturais

Aplicativo mobile (React Native + Expo + TypeScript) para pequenos negócios organizarem pedidos, produtos, cobranças e métricas.

Este documento explica **como o projeto está organizado**, **o que cada página faz** e **como usar cada componente**, com atenção especial aos componentes que têm mais de um tipo (`Header`, `ProdutoCard`, `Input`, `Button`, `NavBar`, `AlertaAtencao`, `MetricaCard` e `FormaPagamento`).

---

## Sumário

1. [Tecnologias e instalação](#1-tecnologias-e-instalação)
2. [Estrutura de pastas](#2-estrutura-de-pastas)
3. [Tema global (cores e tipografia)](#3-tema-global-cores-e-tipografia)
4. [Navegação](#4-navegação)
5. [Páginas](#5-páginas)
6. [Componentes de layout](#6-componentes-de-layout)
7. [Componentes de formulário](#7-componentes-de-formulário)
8. [Componentes de produto e cobrança](#8-componentes-de-produto-e-cobrança)
9. [Componentes da página inicial](#9-componentes-da-página-inicial)
10. [Camada de dados (tipos, services e hooks)](#10-camada-de-dados)
11. [Receitas: como adicionar coisas novas](#11-receitas-como-adicionar-coisas-novas)
12. [Observações e pontos de atenção](#12-observações-e-pontos-de-atenção)

---

## 1. Tecnologias e instalação

| Tecnologia | Uso |
|---|---|
| Expo + React Native + TypeScript | Base do app |
| React Navigation (`native-stack` + `bottom-tabs`) | Navegação entre telas e abas |
| `@expo/vector-icons` (Ionicons) | Ícones |
| `@expo-google-fonts/poppins` | Tipografia |
| `react-native-safe-area-context` | Áreas seguras (notch e barra de gestos) |
| `react-native-gifted-charts` + `react-native-svg` | Gráfico de barras |
| `expo-linear-gradient` | Dependência do gráfico |

```bash
# navegação
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# ícones e fontes
npx expo install @expo/vector-icons expo-font @expo-google-fonts/poppins expo-status-bar

# gráfico
npx expo install react-native-gifted-charts react-native-svg expo-linear-gradient
```

### `App.tsx`

Carrega as fontes e renderiza as rotas dentro do `SafeAreaProvider`:

```tsx
import React from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from "@expo-google-fonts/poppins"

import Routes from "./src/routes"

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    })

    if (!fontsLoaded) return null

    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <Routes />
        </SafeAreaProvider>
    )
}
```

---

## 2. Estrutura de pastas

```
src/
├── assets/images/logo.png
│
├── components/
│   ├── AlertaAtencao/         ← alerta da home (3 tipos)
│   ├── AppLayout/             ← moldura das páginas (status bar + header + conteúdo)
│   ├── AtalhoRapido/          ← atalho com ícone e destino
│   ├── Button/                ← botão (2 formatos, cores do tema, ícone opcional)
│   ├── CardRecebido/          ← card azul "Recebido hoje"
│   ├── Checkbox/              ← checkbox com texto
│   ├── Dropdown/              ← seleção em lista
│   ├── EntregaCard/           ← próxima entrega
│   ├── Estoque/               ← selo de estoque (muda de cor)
│   ├── Filtro/                ← chip de categoria
│   ├── FormaPagamento/        ← pix, cartão e dinheiro
│   ├── GraficoLucroMensal/    ← gráfico de barras
│   ├── Header/                ← cabeçalho (6 tipos)
│   ├── Input/                 ← campo (4 tipos)
│   ├── MetricaCard/           ← lucro, custo e investido
│   ├── NavBar/
│   │   ├── NavBar.tsx         ← barra de abas (+ variante de cobrança)
│   │   ├── NavBarCobranca.tsx ← variante: resumo + botão cobrar
│   │   └── style.ts
│   ├── ProdutoCard/           ← card de produto (2 tipos)
│   ├── Quantidade/            ← controle − 0 +
│   ├── Secao/                 ← título + conteúdo
│   ├── SeletorPeriodo/        ← Hoje / Semana / Mês
│   └── TelaEmConstrucao/      ← placeholder de telas ainda não feitas
│
├── contexts/
│   └── NavBarContext.tsx      ← permite uma tela trocar a NavBar
│
├── global/
│   └── themes.ts              ← cores e tipografia
│
├── hooks/
│   └── useDashboard.ts        ← busca os dados da home
│
├── pages/
│   ├── Login/                 ← Login.tsx + style.ts
│   ├── Cadastro/
│   ├── Inicio/
│   ├── Produtos/
│   ├── Cobrar/
│   ├── Pedidos/
│   ├── Mais/
│   ├── Estoque/
│   ├── Encomendas/
│   ├── Clientes/
│   ├── NovoProduto/
│   ├── DetalheEncomenda/
│   └── DetalheProduto/
│
├── routes/
│   └── index.tsx              ← Stack + Tabs
│
├── services/
│   ├── dashboard.ts           ← simulação do backend (home)
│   └── produtos.ts            ← simulação do backend (produtos e clientes)
│
├── types/
│   ├── dashboard.ts
│   └── produto.ts
│
└── utils/
    └── formatarMoeda.ts
```

### Convenção de cada componente

Cada componente fica em uma pasta com **dois arquivos**:

```
NomeDoComponente/
├── NomeDoComponente.tsx   ← lógica e JSX
└── style.ts               ← StyleSheet.create({...})
```

Os estilos sempre usam `themes.colors` e `themes.typography`. **Nunca escreva cor em hexadecimal direto no componente** (as únicas exceções são `#000` das sombras e dois tons de "pressionado" do `Button`).

---

## 3. Tema global (cores e tipografia)

Arquivo: `src/global/themes.ts`.

### Cores (`themes.colors`)

| Chave | Valor | Uso típico |
|---|---|---|
| `azul-escuro` | `#143642` | Headers, NavBar, card "Recebido" |
| `dourado` | `#D9A441` | Botão principal, ícones de destaque, bolinha da NavBar |
| `dourado-pressionado` | `#C4912F` | Botão dourado quando pressionado |
| `bege-claro` | `#F9F5F0` | Fundo das telas |
| `branco` | `#FFFFFF` | Cards e campos |
| `marrom-suave` | `#8B644C` | Textos de apoio, filtro ativo, "Esqueci minha senha" |
| `texto` | `#143642` | Texto principal |
| `texto-secundario` | `#5F6B70` | Placeholders e legendas |
| `borda` | `#E4D8C8` | Bordas de cards e campos |
| `campo-desabilitado` | `#EFEAE3` | Fundo de círculos de ícone e do controle de quantidade |
| `sucesso` / `fundo-de-sucesso` | `#1F7A4D` / `#E3F2EA` | Estoque normal, lucro, alerta informativo |
| `alerta` / `fundo-de-alerta` | `#9A5C0A` / `#FBEBD0` | Estoque baixo, alerta de aviso |
| `erro` / `fundo-de-erro` | `#B3261E` / `#FBE4E2` | Esgotado, custo, alerta crítico, erro de campo |

### Tipografia (`themes.typography`)

| Chave | Fonte | Tamanho |
|---|---|---|
| `titulo1` | Poppins SemiBold | 24 |
| `titulo2` | Poppins SemiBold | 20 |
| `titulo3` | Poppins SemiBold | 18 |
| `corpo` | Poppins Regular | 16 |
| `apoio` | Poppins Regular | 14 |
| `rotulo` | Poppins Medium | 14 |
| `botao` | Poppins SemiBold | 16 |
| `valorGrande` | Poppins SemiBold | 32 |
| `nav` | Poppins Medium | 12 |

Uso: `...themes.typography.rotulo` dentro do `StyleSheet`, ou `style={[themes.typography.rotulo, { color: ... }]}`.

---

## 4. Navegação

Arquivo: `src/routes/index.tsx`.

```
NavBarProvider
└── NavigationContainer
    └── Stack
        ├── Login
        ├── Cadastro
        ├── Main  ──────────►  Tabs (NavBar customizada)
        │                       ├── Inicio
        │                       ├── Produtos
        │                       ├── Cobrar
        │                       ├── Pedidos
        │                       └── Mais
        ├── Estoque
        ├── Encomendas
        ├── Clientes
        ├── NovoProduto
        ├── DetalheEncomenda   (param: id)
        └── DetalheProduto     (param: id)
```

- **Abas** (`Main`): mostram a `NavBar` embaixo.
- **Telas do Stack** (Estoque, Clientes, DetalheProduto...): abrem **por cima** das abas, então a NavBar some e o usuário volta pelo botão do header ou pelo botão voltar do Android.
- **`NavBarProvider` precisa envolver o `NavigationContainer`.** Sem ele, a NavBar não consegue trocar para a variante de cobrança.

### Tipos de rota

```ts
RootStackParamList   // telas do Stack (e seus parâmetros)
RootTabParamList     // as 5 abas
AppParamList         // as duas juntas, usado em useNavigation<NavigationProp<AppParamList>>()
Destino              // rotas sem parâmetro (usado em AtalhoRapido e AlertaAtencao)
```

### Como navegar

```tsx
import { NavigationProp, useNavigation } from "@react-navigation/native"
import type { AppParamList } from "../../routes"

const navigation = useNavigation<NavigationProp<AppParamList>>()

navigation.navigate("Pedidos")                          // aba ou tela sem parâmetro
navigation.navigate("DetalheProduto", { id: "3" })      // tela com parâmetro
navigation.replace("Main")                              // troca a tela (login → app)
navigation.goBack()                                     // volta
```

Para ler o parâmetro na tela de destino:

```tsx
import { RouteProp, useRoute } from "@react-navigation/native"
import type { RootStackParamList } from "../../routes"

const { params } = useRoute<RouteProp<RootStackParamList, "DetalheProduto">>()
params.id // "3"
```

---

## 5. Páginas

| Página | Pasta | Header | Usa `AppLayout`? | Observação |
|---|---|---|---|---|
| Login | `pages/Login` | `boasVindas` | Não | Scroll e teclado próprios |
| Cadastro | `pages/Cadastro` | `titulo` | Não | Formulário longo com validação |
| Início | `pages/Inicio` | `inicio` | Sim | Dashboard com 8 componentes |
| Produtos | `pages/Produtos` | `catalogo` | Sim | Lista com busca e filtro |
| Cobrar | `pages/Cobrar` | `buscaVoltar` | Sim | **Troca a NavBar** |
| Pedidos | `pages/Pedidos` | `detalhe` | Sim | Provisória |
| Mais | `pages/Mais` | `detalhe` | Sim | Provisória |
| Estoque, Encomendas, Clientes, NovoProduto | `pages/...` | `detalhe` | Sim | Usam `TelaEmConstrucao` |
| DetalheEncomenda | `pages/DetalheEncomenda` | `detalhe` | Sim | Recebe `id` |
| DetalheProduto | `pages/DetalheProduto` | `detalhe` | Sim | Recebe `id` |

### Login

- Header `boasVindas` ("Bem-Vindo ao Conecta.").
- Card branco que ocupa todo o espaço restante da tela, com o conteúdo centralizado na vertical.
- `KeyboardAvoidingView` + `ScrollView`: ao focar em um input, a tela rola até o formulário (o header sobe).
- Campos: `Input tipo="email"` e `Input tipo="senha"` (com olho para mostrar/ocultar).
- Botões: **Entrar** (`navigation.replace("Main")`) e **Criar conta** (`navigate("Cadastro")`).
- Pendências marcadas com `TODO`: autenticar na API e a tela de recuperação de senha.

### Cadastro

- Header `titulo` com logo, "Criar conta" e a descrição.
- Seis campos: nome (`texto`), e-mail (`email`), telefone (`telefone`, com máscara), senha, confirmar senha (`senha`) e nome do negócio (`texto`).
- `Checkbox` de termos de uso.
- **Validação** ao tocar em "Criar conta": os erros aparecem abaixo de cada campo e somem quando o usuário volta a digitar.
- **Scroll por foco:** cada campo é envolvido por um `Campo` interno que informa à tela qual `View` ganhou foco. A tela mede a posição e rola até ela, deixando o campo visível acima do teclado. Se no seu aparelho ficar fora de posição, ajuste o `setTimeout` (150 ms) ou o `- 24` em `rolarParaCampo`.
- "Já tenho conta" volta para o Login.

### Início

- Usa `AppLayout` com header `inicio` fixo no topo. **Só o conteúdo abaixo rola.**
- Enquanto os dados carregam, o header já aparece e o spinner ocupa o lugar do conteúdo.
- Ordem das seções: `SeletorPeriodo` → `CardRecebido` → Atalhos rápidos → Precisa de atenção → Próximas entregas → Métricas (+ gráfico).
- Alertas com quantidade `0` não aparecem, e a seção some se todos forem `0`.
- Ao trocar Hoje/Semana/Mês, o hook busca os dados de novo.

### Produtos

- Header `catalogo`: busca + filtros de categoria.
- `FlatList` de 2 colunas com `ProdutoCard tipo="estoque"`.
- Toque no card → `DetalheProduto` com o `id`.
- Botão flutuante "Adicionar produto" (`Button formato="arredondado"`, posição absoluta) → `NovoProduto`.

### Cobrar

- Header `buscaVoltar`.
- Lista de produtos com `ProdutoCard tipo="quantidade"`.
- No rodapé da lista: `Dropdown` de cliente e as três `FormaPagamento`.
- **A NavBar vira o resumo da cobrança** (itens, total e botão). Veja [NavBar](#navbar-2-variantes) para o funcionamento.
- Estados controlados pela tela:
  - `quantidades: Record<string, number>` (id do produto → quantidade)
  - `cliente: string | null`
  - `pagamento: TipoPagamento | null`
- O total soma **todos** os produtos, inclusive os que a busca escondeu.
- O botão "Cobrar" fica desabilitado até haver pelo menos 1 item **e** uma forma de pagamento. O cliente é opcional.

### Pedidos, Mais e telas provisórias

Exibem apenas o título. Pedidos e Mais usam `header={{ tipo: "detalhe", titulo: "..." }}`. As telas do Stack provisórias usam o `TelaEmConstrucao`.

### DetalheProduto

- Busca o produto pelo `id` recebido (`buscarProduto`).
- Header `detalhe` com o nome do produto.
- Mostra imagem (ou placeholder), categoria, preço, descrição e o botão "Adicionar ao pedido" (`TODO`).
- Se o produto não existir, mostra "Produto não encontrado".

---

## 6. Componentes de layout

### AppLayout

Moldura usada por (quase) todas as páginas. Faz três coisas: pinta a área da status bar de azul, desenha o `Header` escolhido e reserva o resto da tela para o conteúdo.

```tsx
<AppLayout header={{ tipo: "detalhe", titulo: "Estoque" }}>
    {/* conteúdo da página */}
</AppLayout>
```

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `header` | `HeaderProps` | Sim | Objeto com o `tipo` do header e suas props |
| `children` | `ReactNode` | Sim | Conteúdo da página |

> O `header` é um **objeto**. O `AppLayout` faz `<Header {...header} />`, então qualquer prop do tipo escolhido vai dentro dele.

**Login e Cadastro não usam o `AppLayout`**, pois têm `ScrollView` e controle de teclado próprios. Eles usam o `Header` diretamente.

---

### Header (6 tipos)

Um único componente com várias aparências, escolhidas pela prop `tipo`. O TypeScript só aceita as props que existem para o tipo escolhido, e avisa quando falta alguma obrigatória.

| `tipo` | Aparência | Onde é usado |
|---|---|---|
| `boasVindas` | Logo + "Bem-Vindo ao Conecta." | Login |
| `titulo` | Logo + título + descrição | Cadastro |
| `inicio` | Negócio, saudação, avatar e busca | Início |
| `buscaVoltar` | Botão voltar + título + busca | Cobrar |
| `catalogo` | Título + busca + filtros de categoria | Produtos |
| `detalhe` | Botão voltar + título | Detalhes e telas simples |

#### Props comuns de busca (`BuscaProps`)

Usadas em `inicio`, `buscaVoltar` e `catalogo`:

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `busca` | `string` | Sim | Texto atual do campo |
| `onChangeBusca` | `(texto: string) => void` | Sim | Chamada ao digitar |
| `placeholder` | `string` | Não | Padrão: "Buscar produto..." (em `inicio`: "Buscar pedidos, clientes ou produtos") |

#### `boasVindas`

Sem props além do `tipo`.

```tsx
<Header tipo="boasVindas" />
```

#### `titulo`

| Prop | Tipo | Obrigatória |
|---|---|---|
| `titulo` | `string` | Sim |
| `descricao` | `string` | Não |

```tsx
<Header
    tipo="titulo"
    titulo="Criar conta"
    descricao="Cadastre-se e comece a organizar seu negócio com o Conecta."
/>
```

#### `inicio`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `nome` | `string` | Não | Nome do usuário. A saudação ("Bom dia/Boa tarde/Boa noite") é automática pela hora. A inicial vai no avatar |
| `negocio` | `string` | Não | Texto dourado acima da saudação |
| + `BuscaProps` | | | |

```tsx
<AppLayout
    header={{
        tipo: "inicio",
        nome: "Paulo",
        negocio: "Conecta Doces & Naturais",
        busca,
        onChangeBusca: setBusca,
    }}
>
```

`nome` e `negocio` são opcionais porque, enquanto a API carrega, o header já aparece sem eles.

#### `buscaVoltar`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `titulo` | `string` | Sim | |
| `onVoltar` | `() => void` | Não | Se omitido, chama `navigation.goBack()` |
| + `BuscaProps` | | | |

```tsx
header={{
    tipo: "buscaVoltar",
    titulo: "Cobrar pedido",
    busca,
    onChangeBusca: setBusca,
}}
```

#### `catalogo`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `titulo` | `string` | Sim | |
| `categorias` | `string[]` | Sim | Lista de filtros (ex.: `["Todos", "Bolo de pote"]`) |
| `categoriaAtiva` | `string` | Sim | Filtro selecionado |
| `onChangeCategoria` | `(c: string) => void` | Sim | |
| + `BuscaProps` | | | |

```tsx
header={{
    tipo: "catalogo",
    titulo: "Produtos",
    busca,
    onChangeBusca: setBusca,
    categorias: CATEGORIAS,
    categoriaAtiva: categoria,
    onChangeCategoria: setCategoria,
}}
```

Os filtros ficam **abaixo do bloco azul**, sobre o fundo bege, em um `ScrollView` horizontal (rola se houver mais categorias do que cabe na tela). Cada um é um componente [`Filtro`](#filtro).

#### `detalhe`

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `titulo` | `string` | Sim | |
| `onVoltar` | `() => void` | Não | Se omitido, chama `navigation.goBack()` |
| `semVoltar` | `boolean` | Não | Esconde o botão voltar (útil para abas) |

```tsx
header={{ tipo: "detalhe", titulo: "Bolo de Pote Chocolate" }}
header={{ tipo: "detalhe", titulo: "Pedidos", semVoltar: true }}
```

> **Cuidado em abas:** o `goBack()` de uma aba leva à primeira aba (Início), não à tela "anterior". Para Pedidos e Mais, considere `semVoltar: true`.

---

### NavBar (2 variantes)

A `NavBar` é o `tabBar` do navegador de abas. Ela tem duas aparências:

| Variante | Quando aparece | Conteúdo |
|---|---|---|
| **Padrão** | Sempre, exceto na aba Cobrar | 5 abas com ícone, rótulo e bolinha dourada na aba ativa. O botão central "Cobrar" é dourado e sobe acima da barra |
| **Cobrança** | Aba Cobrar em foco | "N itens selecionados", "Total: R$ X" e botão "Cobrar R$ X" |

#### Como a variante é ativada

A NavBar é desenhada pelo **navegador**, não pela tela, então a tela não consegue passar props a ela diretamente. A solução é um contexto (`NavBarContext`):

```
Cobrar (tela)  ──setCobranca({...})──►  NavBarContext  ──cobranca──►  MainTabs  ──prop──►  NavBar
```

1. `MainTabs` lê `cobranca` do contexto e passa para a `NavBar`:
   ```tsx
   const { cobranca } = useNavBar()
   <Tab.Navigator tabBar={(props) => <NavBar {...props} cobranca={cobranca} />}>
   ```
2. Se `cobranca` existe, a `NavBar` renderiza `<NavBarCobranca />`; senão, a barra de abas.
3. A tela **Cobrar** define o valor com `useFocusEffect`, e o limpa ao perder o foco:
   ```tsx
   useFocusEffect(
       useCallback(() => {
           setCobranca({
               itens,
               total,
               desabilitado: itens === 0 || !pagamento,
               onCobrar: () => cobrarRef.current(),
           })

           return () => setCobranca(null)   // ao sair da aba, volta ao normal
       }, [itens, total, pagamento, setCobranca])
   )
   ```

#### Tipo `RodapeCobranca`

| Campo | Tipo | Descrição |
|---|---|---|
| `itens` | `number` | Quantidade total de itens ("1 item selecionado" / "N itens selecionados") |
| `total` | `number` | Valor total (formatado em R$) |
| `desabilitado` | `boolean` | Desabilita o botão |
| `onCobrar` | `() => void` | Ação do botão |

#### Para usar a variante em outra tela

Repita o padrão do `useFocusEffect` acima com `setCobranca(...)`. Se mais telas precisarem de variantes diferentes, generalize o contexto (por exemplo, `variante: "cobranca" | "outra"`).

#### Checklist se a NavBar não trocar

- [ ] `<NavBarProvider>` envolve o `<NavigationContainer>` em `Routes`.
- [ ] `MainTabs` passa `cobranca={cobranca}` para a `NavBar`.
- [ ] `NavBar.tsx` tem a prop `cobranca` e o `if (cobranca) return <NavBarCobranca ... />`.
- [ ] `routes`, `NavBar` e `Cobrar` importam o **mesmo** arquivo `contexts/NavBarContext.tsx`.

#### Detalhes da barra padrão

- `TABS` mapeia cada rota para rótulo, ícone normal e ícone ativo (ex.: `home-outline` → `home`).
- Aba ativa: ícone e rótulo brancos, ícone preenchido e bolinha dourada. Nas inativas a bolinha existe com `opacity: 0`, para o layout não "pular".
- O botão central ocupa a altura total do item, então fica clicável inteiro (inclusive a parte que sobe).
- A altura soma `insets.bottom` (barra de gestos).

---

### Secao

Título + conteúdo, com espaçamento padrão. Usado em todas as seções da home.

```tsx
<Secao titulo="Atalhos rápidos">
    {/* conteúdo */}
</Secao>
```

### TelaEmConstrucao

Placeholder para telas ainda não implementadas.

```tsx
<TelaEmConstrucao titulo="Estoque" />
```

---

## 7. Componentes de formulário

### Input (4 tipos)

Campo de texto que muda de comportamento conforme o `tipo`.

| `tipo` | Teclado | Comportamento extra |
|---|---|---|
| `email` | `email-address` | Sem capitalização e sem autocorreção; autocomplete de e-mail |
| `senha` | padrão | Texto oculto + **ícone de olho** para mostrar/ocultar |
| `telefone` | numérico | **Máscara automática** `(11) 2345-6789` ou `(11) 92345-6789`, máximo 15 caracteres |
| `texto` | padrão | Cada palavra começa com maiúscula (bom para nomes) |

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `tipo` | `"email" \| "senha" \| "telefone" \| "texto"` | Sim | |
| `label` | `string` | Não | Rótulo acima do campo |
| `erro` | `string` | Não | Mensagem em vermelho abaixo; borda vermelha |
| demais | `TextInputProps` | | `value`, `onChangeText`, `placeholder`, `onFocus`... (exceto `secureTextEntry` e `keyboardType`, controlados pelo `tipo`) |

```tsx
<Input
    tipo="email"
    label="E-mail"
    placeholder="Insira seu e-mail"
    value={email}
    onChangeText={setEmail}
/>

<Input tipo="senha" label="Senha" value={senha} onChangeText={setSenha} />

<Input
    tipo="telefone"
    label="Telefone"
    placeholder="(00) 0000-0000"
    value={telefone}
    onChangeText={setTelefone}   // já chega formatado
    erro={erros.telefone}
/>
```

Estados visuais: borda `borda` (normal), `dourado` (focado) e `erro` (com erro). Para obter só os números do telefone: `telefone.replace(/\D/g, "")`.

### Button (formatos e cores)

| Prop | Valores | Padrão | Descrição |
|---|---|---|---|
| `texto` | `string` | — | Obrigatória |
| `cor` | qualquer chave de `themes.colors` | `"dourado"` | Cor de fundo |
| `formato` | `"quadrado"` \| `"arredondado"` | `"quadrado"` | Veja abaixo |
| `icone` | nome de ícone Ionicons | — | Opcional |
| `posicaoIcone` | `"esquerda"` \| `"direita"` | `"esquerda"` | |
| `corTexto` | chave de `themes.colors` | automática | Cor do texto e do ícone |
| `disabled` | `boolean` | `false` | Opacidade 50% e sem toque |
| `style` | `ViewStyle` | — | Estilo extra (ex.: posição absoluta) |
| demais | `PressableProps` | | `onPress` etc. |

**Formatos:**

| Formato | Raio | Largura |
|---|---|---|
| `quadrado` | 12 | **Ocupa toda a largura** da View pai |
| `arredondado` | pílula | Só o tamanho do conteúdo, com folga nos lados |

**Cor ao pressionar:** o botão escurece usando o mapa `COR_PRESSIONADA` em `Button.tsx`:

| Cor | Pressionado |
|---|---|
| `dourado` | `dourado-pressionado` |
| `azul-escuro` | `#0E2830` |
| `bege-claro` | `campo-desabilitado` |
| `branco` | `bege-claro` |
| `marrom-suave` | `#76523D` |

Cores que não estão no mapa (ex.: `sucesso`) ficam iguais ao pressionar. Para incluí-las, adicione uma linha no mapa.

**Cor do texto automática:** `azul-escuro` e `marrom-suave` usam texto branco; as demais usam `azul-escuro`.

```tsx
<Button texto="Entrar" onPress={entrar} />                                      {/* largura total */}
<Button texto="Criar conta" cor="bege-claro" onPress={criarConta} />
<Button texto="Novo pedido" formato="arredondado" icone="cart-outline" />
<Button texto="Continuar" icone="chevron-forward" posicaoIcone="direita" />
<Button texto="Sair" cor="azul-escuro" formato="arredondado" />
<Button texto="Entrar" disabled />
```

### Checkbox

Caixa de seleção com texto. O texto é um `<Text>` que aceita filhos (útil para um link dentro da frase).

| Prop | Tipo | Descrição |
|---|---|---|
| `marcado` | `boolean` | |
| `onChange` | `(valor: boolean) => void` | |
| `children` | `ReactNode` | Texto ao lado |
| `erro` | `boolean` | Borda vermelha se não marcado |

```tsx
<Checkbox marcado={aceito} onChange={setAceito} erro={!!erros.termos}>
    Aceito os{" "}
    <Text style={style.link} onPress={abrirTermos}>termos de uso</Text>
</Checkbox>
```

### Dropdown

Campo que abre uma lista logo abaixo, **empurrando o conteúdo** (não flutua por cima), o que funciona bem dentro de scroll, principalmente no Android.

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `opcoes` | `{ valor: string; label: string }[]` | Sim | |
| `valor` | `string \| null` | Sim | `valor` da opção selecionada |
| `onChange` | `(valor: string) => void` | Sim | |
| `label` | `string` | Não | Rótulo acima |
| `placeholder` | `string` | Não | Padrão: "Selecione" |

```tsx
<Dropdown
    label="Cliente"
    placeholder="Selecione o cliente"
    opcoes={CLIENTES}
    valor={cliente}
    onChange={setCliente}
/>
```

A lista tem altura máxima de 220 e rola quando passa disso. A opção selecionada aparece em negrito.

### Filtro

Chip de categoria. Selecionado: fundo colorido (`marrom-suave`) e texto branco. Não selecionado: **fundo transparente**.

| Prop | Tipo |
|---|---|
| `texto` | `string` |
| `ativo` | `boolean` |
| `onPress` | `() => void` |

```tsx
<Filtro texto="Lanche" ativo={categoria === "Lanche"} onPress={() => setCategoria("Lanche")} />
```

É usado pelo header `catalogo`, mas pode ser usado em qualquer lugar.

---

## 8. Componentes de produto e cobrança

### ProdutoCard (2 tipos)

Card de produto com foto, nome e preço. O **rodapé muda** conforme o `tipo`.

| `tipo` | Rodapé | Interação | Usado em |
|---|---|---|---|
| `estoque` | Selo [`Estoque`](#estoque-muda-de-cor) | O card inteiro é clicável (`onPress`) | Produtos |
| `quantidade` | Controle [`Quantidade`](#quantidade) (− 0 +) | Só os botões − e + | Cobrar |

**Props do tipo `estoque`:**

| Prop | Tipo | Obrigatória |
|---|---|---|
| `produto` | `Produto` | Sim |
| `onPress` | `() => void` | Não |

**Props do tipo `quantidade`:**

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `produto` | `Produto` | Sim | |
| `quantidade` | `number` | Sim | Valor atual |
| `onChangeQuantidade` | `(q: number) => void` | Sim | |

```tsx
// Produtos
<ProdutoCard
    tipo="estoque"
    produto={item}
    onPress={() => navigation.navigate("DetalheProduto", { id: item.id })}
/>

// Cobrar
<ProdutoCard
    tipo="quantidade"
    produto={item}
    quantidade={quantidades[item.id] ?? 0}
    onChangeQuantidade={(q) => alterarQuantidade(item.id, q)}
/>
```

Detalhes:

- No tipo `quantidade`, o `+` para no estoque do produto (`max={produto.estoque}`). Um produto esgotado não deixa aumentar.
- Sem `imagem`, o card mostra um ícone de placeholder.
- O nome reserva 2 linhas (`minHeight: 40`) para os cards ficarem alinhados.
- Preço: verde no tipo `estoque`, cor do texto no tipo `quantidade`.
- Largura `48%`, então use `FlatList` com `numColumns={2}` e `columnWrapperStyle={{ justifyContent: "space-between" }}`.

### Estoque (muda de cor)

Selo que mostra o estoque e muda de cor conforme o número vindo do backend.

| Quantidade | Texto | Cor |
|---|---|---|
| `0` (ou menos) | "Esgotado" | Vermelho (`erro` / `fundo-de-erro`) |
| `1` até `limiteBaixo` | "Baixo: N" | Amarelo (`alerta` / `fundo-de-alerta`) |
| acima de `limiteBaixo` | "Em estoque: N" | Verde (`sucesso` / `fundo-de-sucesso`) |

| Prop | Tipo | Padrão |
|---|---|---|
| `quantidade` | `number` | — |
| `limiteBaixo` | `number` | `3` |

```tsx
<Estoque quantidade={8} />                    // verde
<Estoque quantidade={2} />                    // amarelo "Baixo: 2"
<Estoque quantidade={0} />                    // vermelho "Esgotado"
<Estoque quantidade={8} limiteBaixo={10} />   // amarelo "Baixo: 8"
```

### Quantidade

Controle `− valor +`.

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `valor` | `number` | — | |
| `onChange` | `(v: number) => void` | — | Recebe o novo valor |
| `min` | `number` | `0` | O `−` fica desabilitado ao chegar aqui |
| `max` | `number` | sem limite | O `+` fica desabilitado ao chegar aqui |

```tsx
<Quantidade valor={qtd} onChange={setQtd} max={produto.estoque} />
```

### FormaPagamento (3 tipos)

Opção de pagamento. Quando selecionada, mostra a borda escura, o texto em negrito e um **check** no canto.

| `tipo` | Texto | Ícone |
|---|---|---|
| `pix` | PIX | `flash-outline` |
| `cartao` | Cartão | `card-outline` |
| `dinheiro` | Dinheiro | `cash-outline` |

| Prop | Tipo |
|---|---|
| `tipo` | `"pix" \| "cartao" \| "dinheiro"` |
| `selecionado` | `boolean` |
| `onPress` | `() => void` |

O arquivo também exporta `PAGAMENTOS` (ordem de exibição) e o tipo `TipoPagamento`:

```tsx
const [pagamento, setPagamento] = useState<TipoPagamento | null>(null)

<View style={{ flexDirection: "row", gap: 10 }}>
    {PAGAMENTOS.map((tipo) => (
        <FormaPagamento
            key={tipo}
            tipo={tipo}
            selecionado={pagamento === tipo}
            onPress={() => setPagamento(tipo)}
        />
    ))}
</View>
```

---

## 9. Componentes da página inicial

### CardRecebido

Card azul com o valor recebido, meta, pedidos e dois botões. Todos os dados vêm do backend.

| Prop | Tipo | Descrição |
|---|---|---|
| `titulo` | `string` | Ex.: "Recebido hoje" |
| `valor` | `number` | Valor recebido |
| `meta` | `number` | |
| `pedidos` | `number` | |
| `onCobrar` | `() => void` | Botão "Cobrar agora" (dourado) |
| `onReceber` | `() => void` | Botão "A receber" (branco) |

```tsx
<CardRecebido
    titulo="Recebido hoje"
    valor={dados.recebido.valor}
    meta={dados.recebido.meta}
    pedidos={dados.recebido.pedidos}
    onCobrar={() => navigation.navigate("Cobrar")}
    onReceber={() => navigation.navigate("Pedidos")}
/>
```

### SeletorPeriodo

Pílulas "Hoje / Semana / Mês". A ativa fica azul-escura.

```tsx
<SeletorPeriodo valor={periodo} onChange={setPeriodo} />   // Periodo = "hoje" | "semana" | "mes"
```

### AtalhoRapido

Card com ícone em círculo e texto, que **leva o usuário a uma tela**.

| Prop | Tipo | Descrição |
|---|---|---|
| `icone` | nome de ícone Ionicons | |
| `texto` | `string` | Até 2 linhas |
| `destino` | `Destino` | Rota sem parâmetros |

```tsx
const ATALHOS = [
    { icone: "add-circle-outline", texto: "Novo produto", destino: "NovoProduto" },
    { icone: "cash-outline", texto: "Cobrar", destino: "Cobrar" },
    { icone: "people-outline", texto: "Clientes", destino: "Clientes" },
    { icone: "calendar-outline", texto: "Encomendas", destino: "Encomendas" },
]

<View style={{ flexDirection: "row", gap: 8 }}>
    {ATALHOS.map((a) => <AtalhoRapido key={a.texto} {...a} />)}
</View>
```

O card tem `flex: 1`, então os atalhos dividem a largura igualmente.

### AlertaAtencao (3 tipos)

Item da seção "Precisa de atenção". **Título, ícone, cores e destino são fixos por tipo**. O backend manda apenas a **quantidade**, e a descrição trata singular e plural.

| `tipo` | Cor | Título | Ícone | Descrição (N = quantidade) | Leva a |
|---|---|---|---|---|---|
| `critico` | Vermelho | Estoque baixo | `warning-outline` | "N itens precisam ser repostos" | `Estoque` |
| `aviso` | Amarelo | Pedidos pendentes | `alert-circle-outline` | "N pedidos aguardando confirmação" | `Pedidos` |
| `informativo` | Verde | Encomendas hoje | `time-outline` | "N entregas agendadas para hoje" | `Encomendas` |

| Prop | Tipo |
|---|---|
| `tipo` | `"critico" \| "aviso" \| "informativo"` |
| `quantidade` | `number` |

```tsx
<AlertaAtencao tipo="critico" quantidade={2} />
```

Para alterar um texto, cor ou destino, edite o objeto `CONFIG` em `AlertaAtencao.tsx`.

### EntregaCard

Item de "Próximas entregas". Leva à `DetalheEncomenda` com o `id`.

| Prop | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Id da encomenda (vai como parâmetro) |
| `nome` | `string` | "Entrega para {nome}" |
| `dia` | `string` | **Já formatado**: "Hoje", "Amanhã", "22/10" |
| `hora` | `string` | "16:30" |

```tsx
<EntregaCard id="1042" nome="Marina" dia="Hoje" hora="16:30" />
```

### MetricaCard (3 tipos)

Card pequeno com valor. **Não leva a nenhuma página.**

| `tipo` | Rótulo | Cor do ponto | Cor do valor |
|---|---|---|---|
| `lucro` | Lucro | Verde | Verde |
| `custo` | Custo | Vermelho | Vermelho |
| `investido` | Investido | Dourado | Azul-escuro |

```tsx
<View style={{ flexDirection: "row", gap: 8 }}>
    <MetricaCard tipo="lucro" valor={1847.5} />
    <MetricaCard tipo="custo" valor={623} />
    <MetricaCard tipo="investido" valor={2470.5} />
</View>
```

O valor é formatado em reais e reduz a fonte automaticamente se não couber (`adjustsFontSizeToFit`).

### GraficoLucroMensal

Gráfico de barras douradas (topo arredondado), sem eixos nem grade, com os meses embaixo. Usa `react-native-gifted-charts`.

| Prop | Tipo | Padrão |
|---|---|---|
| `dados` | `{ mes: string; valor: number }[]` | — |
| `titulo` | `string` | "Lucro mensal" |
| `legenda` | `string` | "Receita líquida" |

```tsx
<GraficoLucroMensal
    dados={[
        { mes: "Ago", valor: 320 },
        { mes: "Set", valor: 480 },
    ]}
/>
```

O componente mede a largura do card (`onLayout`) e distribui as barras igualmente. Se os meses ficarem fora de centro, ajuste `LARGURA_BARRA` ou adicione `labelWidth` nos itens de `data`.

---

## 10. Camada de dados

Todos os dados são **simulados** nos arquivos de `services/`. Para integrar o backend, troque apenas o corpo das funções; **os componentes e as páginas não mudam**.

### Tipos

```ts
// types/dashboard.ts
type Periodo = "hoje" | "semana" | "mes"
type TipoAlerta = "critico" | "aviso" | "informativo"
type TipoMetrica = "lucro" | "custo" | "investido"

type Dashboard = {
    usuario: { nome: string; negocio: string }
    recebido: { valor: number; meta: number; pedidos: number }
    alertas: { tipo: TipoAlerta; quantidade: number }[]
    proximasEntregas: { id: string; nome: string; dia: string; hora: string }[]
    metricas: Record<TipoMetrica, number>
    lucroMensal: { mes: string; valor: number }[]
}

// types/produto.ts
type Produto = {
    id: string
    nome: string
    preco: number
    categoria: string
    descricao: string
    estoque: number
    imagem?: string   // URL vinda do backend
}
```

### Services

| Função | Arquivo | O que faz hoje | Substitua por |
|---|---|---|---|
| `buscarDashboard(periodo)` | `services/dashboard.ts` | Retorna dados fixos após 600 ms | `fetch(`${API_URL}/dashboard?periodo=${periodo}`)` |
| `listarProdutos()` | `services/produtos.ts` | Lista fixa | `GET /produtos` |
| `filtrarProdutos(busca, categoria)` | `services/produtos.ts` | Filtra a lista fixa (ignora acentos e maiúsculas) | `GET /produtos?busca=&categoria=` |
| `buscarProduto(id)` | `services/produtos.ts` | Procura na lista fixa | `GET /produtos/:id` |
| `CATEGORIAS`, `CLIENTES` | `services/produtos.ts` | Constantes | `GET /categorias`, `GET /clientes` |

### Hook

```tsx
const { dados } = useDashboard(periodo)   // dados é null durante a primeira carga
```

Busca de novo sempre que o `periodo` muda e ignora respostas atrasadas (flag `cancelado` no `useEffect`).

### Utilitário

```ts
formatarMoeda(1847.5)   // "R$ 1.847,50"
formatarMoeda(-20)      // "-R$ 20,00"
```

---

## 11. Receitas: como adicionar coisas novas

### Novo tipo de Header

Em `Header.tsx`:

1. Adicione uma linha na união `HeaderProps`:
   ```tsx
   | { tipo: "meuTipo"; titulo: string; onVoltar?: () => void }
   ```
2. Crie o componente interno (reutilize `Topo`, `Busca`, `BotaoVoltar` ou `HeaderLogo` quando possível).
3. Adicione o `case` no `switch` do componente `Header`.
4. Adicione os estilos em `Header/style.ts`.

Se o TypeScript reclamar que falta um `case`, é porque o novo tipo não foi tratado no `switch`.

### Nova página

1. Crie `pages/MinhaPagina/MinhaPagina.tsx` (e `style.ts` se precisar).
2. Envolva com `AppLayout` e escolha o header:
   ```tsx
   export default function MinhaPagina() {
       return (
           <AppLayout header={{ tipo: "detalhe", titulo: "Minha página" }}>
               {/* conteúdo */}
           </AppLayout>
       )
   }
   ```
3. Registre em `routes/index.tsx`: adicione ao `RootStackParamList`, importe e crie o `<Stack.Screen />`.
4. Se for navegável por atalho ou alerta (sem parâmetros), ela já entra em `Destino` automaticamente. Se tiver parâmetro, adicione-a na lista do `Exclude` de `Destino`.

### Nova aba

1. Adicione em `RootTabParamList`.
2. Crie o `<Tab.Screen />` em `MainTabs` (a ordem define a ordem na barra).
3. Adicione uma entrada em `TABS` no `NavBar.tsx` (rótulo, ícone normal e ícone ativo).

### Nova cor de botão

1. A cor precisa existir em `themes.colors`.
2. Adicione a cor de "pressionado" em `COR_PRESSIONADA` e, se o fundo for escuro, a cor do texto em `COR_TEXTO_PADRAO`, ambos em `Button.tsx`.

### Novo componente

Siga a convenção: pasta com `NomeDoComponente.tsx` + `style.ts`, estilos pelo `themes`, e props tipadas. Se o componente tiver aparências diferentes, use **união discriminada** com a prop `tipo`, como `Header` e `ProdutoCard`. Assim o TypeScript só aceita as props válidas de cada tipo.

---

## 12. Observações e pontos de atenção

- **Cores fora do tema:** o filtro ativo e o botão de selecionado do design usam um terracota que não existe no tema, e o subtítulo do login usa um tom avermelhado. Hoje usam `marrom-suave`. Para a cor exata, adicione ao `themes.colors` algo como `"terracota": "#BE6B4D"` e troque em `Filtro/style.ts` e `Login/style.ts`.
- **Botão voltar em abas:** `goBack()` a partir de uma aba leva à primeira aba. Em Pedidos e Mais, use `semVoltar: true` se não fizer sentido voltar.
- **Telas do Stack escondem a NavBar.** Se quiser a NavBar em Estoque, Clientes etc., elas precisam virar abas ocultas.
- **KeyboardAvoidingView no Android:** o Login e o Cadastro usam `behavior="padding"`. Se aparecer um espaço duplicado acima do teclado, use `behavior={Platform.OS === "ios" ? "padding" : undefined}`.
- **Imports de pasta:** algumas páginas importam componentes pela pasta (`../../components/ProdutoCard/`), o que exige um `index.tsx` na pasta que reexporte o componente. Outras importam direto o arquivo (`.../ProdutoCard/ProdutoCard`). Escolha um padrão e mantenha em todo o projeto.
- **Pastas que podem ser apagadas:** `components/HeaderInicio`, substituída pelo tipo `inicio` do `Header`.
- **Pendências marcadas com `TODO` no código:** autenticação (Login), envio do cadastro (Cadastro), recuperação de senha, termos de uso, geração da cobrança (Cobrar) e "Adicionar ao pedido" (DetalheProduto).
- **Datas das entregas:** o backend deve enviar `dia` já formatado ("Hoje", "Amanhã", "22/10").