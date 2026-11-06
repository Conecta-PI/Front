# Pendências de integração com a API

Este arquivo registra o estado atual dos endpoints do projeto e serve como
checklist de integração entre frontend e backend.

Legenda:
- ✅ Concluído
- ⚠️ Parcial / com ajuste pendente
- ❌ Não implementado

Regra de contrato: o frontend define o formato esperado para campos, nomes e valores visuais da tela; o backend deve seguir esse contrato e não impor nomes/valores diferentes da interface.

## Atualização de status

A partir da última rodada de integração, os módulos de telas mais recentes já
receberam endpoints no backend. O foco principal foi alinhar a API ao contrato do
frontend, sem alterar layout.

## Status geral da API

| Área | Endpoint | Status | Observação |
|---|---|---|---|
| Autenticação | `POST /api/auth/register` | ✅ Concluído | Cadastro do responsável funcionando. |
| Autenticação | `POST /api/auth/login` | ✅ Concluído | Login e geração do JWT funcionando. |
| Autenticação | `POST /api/auth/forgot-password` | ✅ Concluído | Fluxo de recuperação com código de teste implementado no backend. |
| Autenticação | `POST /api/auth/verify-recovery-code` | ✅ Concluído | Validação de código de recuperação disponível. |
| Autenticação | `POST /api/auth/reset-password` | ✅ Concluído | Redefinição da senha com validação do código. |
| Perfil | `GET /api/perfil` | ✅ Concluído | Contrato e dados do responsável persistidos no backend. |
| Perfil | `PATCH /api/perfil` | ✅ Concluído | Edição de dados do responsável implementada. |
| Perfil | `POST /api/auth/logout` | ✅ Local | Logout real continua sendo feito no frontend limpando o token guardado. |
| Clientes | `GET /api/clientes` | ✅ Concluído | Listagem funcionando. |
| Clientes | `GET /api/clientes/{id}` | ✅ Concluído | Detalhe do cliente disponível. |
| Clientes | `POST /api/clientes` | ✅ Concluído | Cadastro de cliente persistido. |
| Clientes | `PATCH /api/clientes/{id}` | ✅ Concluído | Edição disponível. |
| Clientes | `DELETE /api/clientes/{id}` | ✅ Concluído | Exclusão disponível quando não há vendas vinculadas. |
| Clientes | `GET /api/clientes/{id}/resumo` | ✅ Concluído | Resumo com total gasto, histórico e pendências implementado. |
| Clientes | `PATCH /api/clientes/{id}/observacao` | ✅ Concluído | Observação persistida. |
| Produtos | `GET /api/produtos` | ✅ Concluído | Listagem de produtos funcionando. |
| Produtos | `GET /api/produtos/{id}` | ✅ Concluído | Busca por id disponível. |
| Produtos | `POST /api/produtos` | ✅ Concluído | Cadastro real do produto implementado. |
| Produtos | `PATCH /api/produtos/{id}` | ✅ Concluído | Edição do produto disponível. |
| Produtos | `DELETE /api/produtos/{id}` | ✅ Concluído | Desativação do produto disponível. |
| Produtos | `GET /api/produtos/categorias` | ✅ Concluído | Listagem de categorias disponível. |
| Produtos | `GET /api/produtos/{id}/ficha-tecnica` | ✅ Concluído | Ficha técnica disponível por produto. |
| Produtos | `PATCH /api/produtos/{id}/ficha-tecnica` | ✅ Concluído | Atualização de dados da ficha técnica disponível. |
| Produtos | suporte a `foto`, `preparo`, `rendimento`, `ingredientes` | ✅ Concluído | Contrato dos campos está alinhado ao frontend. |
| Dashboard | `GET /api/dashboard?periodo=...` | ✅ Concluído | Endpoint funcional e consumido pelo frontend. |
| Dashboard | `alertas[].tipo` alinhamento de contrato | ✅ Concluído | Estrutura ajustada para o formato da tela. |
| Vendas | `GET /api/vendas` | ✅ Concluído | Listagem de vendas implementada. |
| Vendas | `POST /api/vendas` | ✅ Concluído | Criação de vendas implementada. |
| Vendas | `GET /api/vendas/{id}` | ✅ Concluído | Detalhe da venda com itens disponível. |
| Vendas | `PATCH /api/vendas/{id}` | ✅ Concluído | Alteração de status e forma de pagamento disponível. |
| Vendas | `DELETE /api/vendas/{id}` | ✅ Concluído | Cancelamento de venda disponível. |
| Encomendas | `GET /api/encomendas` | ✅ Concluído | Listagem disponível. |
| Encomendas | `GET /api/encomendas/{id}` | ✅ Concluído | Detalhe da encomenda disponível. |
| Encomendas | `POST /api/encomendas` | ✅ Concluído | Criação da encomenda persistida. |
| Encomendas | `PATCH /api/encomendas/{id}/status` | ✅ Concluído | Atualização de status disponível. |
| Financeiro | `GET /api/financeiro/resumo` | ✅ Concluído | Resumo financeiro disponível. |
| Financeiro | `GET /api/financeiro/lancamentos` | ✅ Concluído | Lançamentos listados. |
| Financeiro | `POST /api/financeiro/lancamentos` | ✅ Concluído | Criação de lançamento disponível. |
| Lista de compras | `GET /api/lista-compras` | ✅ Concluído | Listagem implementada. |
| Lista de compras | `GET /api/lista-compras/{id}` | ✅ Concluído | Busca por id implementada. |
| Lista de compras | `POST /api/lista-compras` | ✅ Concluído | Criação da lista persistida. |
| Lista de compras | `PATCH /api/lista-compras/{id}` | ✅ Concluído | Atualização disponível. |
| Lista de compras | `DELETE /api/lista-compras/{id}` | ✅ Concluído | Exclusão disponível. |
| Fornecedores | `GET /api/fornecedores` | ✅ Concluído | Listagem funcionando. |
| Fornecedores | `GET /api/fornecedores/{id}` | ✅ Concluído | Busca por id disponível. |
| Fornecedores | `POST /api/fornecedores` | ✅ Concluído | Cadastro persistido. |
| Fornecedores | `PATCH /api/fornecedores/{id}` | ✅ Concluído | Atualização disponível. |
| Fornecedores | `DELETE /api/fornecedores/{id}` | ✅ Concluído | Exclusão disponível. |
| Relatórios | `GET /api/relatorios/resumo` | ✅ Concluído | Resumo do módulo disponível. |
| Relatórios | `GET /api/relatorios/vendas` | ✅ Concluído | Dados de vendas por período disponíveis. |
| Relatórios | `GET /api/relatorios/financeiro` | ✅ Concluído | Dados financeiros disponíveis. |
| Configurações | `GET /api/configuracoes` | ✅ Concluído | Listagem de configurações implementada. |
| Configurações | `PATCH /api/configuracoes` | ✅ Concluído | Atualização de configurações disponível. |
| Configurações | `GET /api/configuracoes/notificacoes` | ✅ Concluído | Notificações disponíveis. |

## Telas implantadas posteriormente e status real

| Tela / fluxo | Status da integração | Endpoint / contrato | Evidência no frontend |
|---|---|---|---|
| Perfil / "Mais" | ✅ Concluído | `GET /api/perfil`, `PATCH /api/perfil`, logout local via remoção do token | `src/services/perfil.ts` consulta a API e `src/pages/Mais/Mais.tsx` limpa o token ao sair. |
| Pedidos / Início (busca) | ✅ Concluído | `GET /api/vendas` (agora com `itens`) | `src/services/pedido.ts` mapeia vendas para o card de pedido; vendas canceladas ficam de fora. |
| Recuperação de senha | ✅ Concluído | `POST /api/auth/forgot-password`, `verify-recovery-code`, `reset-password` | Fluxo por e-mail com código de 6 dígitos; o backend devolve o código de teste na mensagem (sem envio real de e-mail). A opção SMS foi removida porque o backend não a suporta. |
| Clientes | ✅ Concluído | `GET /api/clientes` (com resumo), `GET /api/clientes/{id}`, `GET /api/clientes/{id}/resumo`, `PATCH .../observacao` | Dados de demonstração (`clientesMocks`) removidos; histórico e métricas vêm do backend. |
| Encomendas | ✅ Concluído | `GET /api/encomendas`, `GET /api/encomendas/{id}`, `POST /api/encomendas`, `PATCH /api/encomendas/{id}/status` | `src/pages/Encomendas/Encomendas.tsx` e `src/pages/DetalheEncomenda/DetalheEncomenda.tsx` consomem a API real. |
| Financeiro | ✅ Concluído | `GET /api/financeiro/resumo`, `GET /api/financeiro/lancamentos`, `POST /api/financeiro/lancamentos` | `src/pages/Financeiro/Financeiro.tsx` usa dados reais. |
| Lista de compras | ✅ Concluído | `GET /api/lista-compras`, `POST /api/lista-compras`, `PATCH /api/lista-compras/{id}`, `DELETE /api/lista-compras/{id}` | `src/pages/ListaCompras/ListaCompras.tsx` consome a API. |
| Fornecedores | ✅ Concluído | `GET /api/fornecedores`, `GET /api/fornecedores/{id}`, `POST /api/fornecedores`, `PATCH /api/fornecedores/{id}`, `DELETE /api/fornecedores/{id}` | `src/pages/Fornecedores/Fornecedores.tsx` agora integra com os endpoints reais. |
| Ficha técnica | ⚠️ Parcial | `GET /api/produtos/{id}/ficha-tecnica` | `src/pages/FichaTecnica/FichaTecnica.tsx` lista os produtos e exibe a ficha do selecionado. O `PATCH` existe no backend, mas ainda não há tela de edição. |
| Relatórios | ✅ Concluído | `GET /api/relatorios/resumo`, `GET /api/relatorios/vendas`, `GET /api/relatorios/financeiro` | `src/pages/Relatorios/Relatorios.tsx` usa a API. |
| Configurações | ✅ Concluído | `GET /api/configuracoes`, `PATCH /api/configuracoes`, `GET /api/configuracoes/notificacoes` | `src/pages/Configuracoes/Configuracoes.tsx` integra com o backend. |
| Cadastro de produto novo | ✅ Concluído | `POST /api/produtos` (+ `GET /api/produtos/categorias`) | `src/services/produtos.ts` envia o payload real; a foto escolhida segue como data URL (coluna `MEDIUMTEXT`). Categorias vêm da API, com padrão local se vazia. |

> Auditoria de 05/11/2026: os itens acima foram conferidos contra o código do front. Antes desta rodada, Pedidos, Recuperação de senha, Clientes (parte) e Cadastro de produto ainda usavam dados fixos ou simulados.

## Pendências relevantes hoje

As pendências atuais não são mais de ausência de endpoint, e sim de refinamento do contrato e regra de negócio.

1. Validar se alguns campos de produto devem seguir um formato final de enum/valor em todas as telas.
2. Ajustar nomes e valores de dados que são exibidos na interface para ficar 100% consistente entre backend e frontend.
3. Validar se o fluxo de textos e alertas no dashboard continua estável em produção/local.
4. Confirmar se os dados de relatório e financeiro estão refletindo exatamente o que o negócio precisa visualizar.
5. Continuar a checagem de UX e validação manual de cada tela em execução real.

## Contratos que precisam de alinhamento

- O dashboard retorna `alertas[].tipo` com valores do backend, enquanto o
  frontend usa os valores visuais esperados pela tela.
- O perfil do responsável em `src/services/perfil.ts` consulta `GET /api/perfil`
  e `PATCH /api/perfil` em vez de dados fixos.
- `GET /api/vendas` trabalha com status compatível com o frontend, com valores
  de status e forma de pagamento já alinhados.
- O cadastro de produto do frontend e o payload do backend já estão sincronizados
  para `foto`, `preparo`, `rendimento`, `ingredientes` e `ativo`.
- O endpoint `PATCH /api/produtos/{id}/ficha-tecnica` foi adicionado para o fluxo
  de ficha técnica e segue o contrato da tela.

## Estado atual por funcionalidade

### Autenticação
- Status: concluído.
- O que já existe: registro, login, recuperação de senha e validação do código.

### Produtos
- Status: concluído.
- O que já existe: listagem, busca, cadastro, edição, exclusão e ficha técnica.

### Clientes
- Status: concluído.
- O que já existe: listagem, detalhe, cadastro, edição, exclusão e resumo.

### Vendas e pedidos
- Status: concluído.
- O que já existe: listagem, detalhe, cancelamento, alteração de status e criação.

### Dashboard
- Status: concluído.
- O que já existe: endpoint e estrutura da resposta, já consumida pela tela.

### Módulos recentes
- Status: concluído.
- O que já existe: encomendas, financeiro, lista de compras, fornecedores,
  relatórios e configurações com endpoints e integração real.

## Ordem da execução atual

1. Validar em execução real cada tela no frontend.
2. Revisar dados e messagens finais de negócio.
3. Ajustar pequenos refinamentos de contrato, se algum valor visual ainda não bater 100%.
4. Continuar evoluindo regras de negócio e filtros conforme uso real do sistema.

Este documento deve ser atualizado sempre que um endpoint for implementado,
ajustado ou descartado, para manter o histórico e facilitar a visibilidade da
equipe.
