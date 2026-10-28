# Pendências de integração com a API

Este arquivo registra funcionalidades previstas nas telas do frontend que ainda
não possuem suporte correspondente no backend, além de contratos que precisam
ser confirmados antes da integração.

## Endpoints ainda inexistentes

### Autenticação e conta

- `POST /auth/forgot-password` — solicitar recuperação de senha.
- `POST /auth/verify-recovery-code` — validar código de recuperação.
- `POST /auth/reset-password` — definir nova senha.
- `GET /perfil` — obter os dados completos do responsável.
- `PATCH /perfil` — editar dados do responsável.
- `POST /auth/logout` — opcional; atualmente o logout pode ser feito apenas
  removendo o token localmente.

### Clientes

- `POST /clientes` — cadastrar cliente.
- `GET /clientes/{id}` — obter detalhes de um cliente.
- `PATCH /clientes/{id}` — editar cliente.
- `DELETE /clientes/{id}` — excluir cliente.

### Produtos

- `PATCH /produtos/{id}` — editar produto.
- `DELETE /produtos/{id}` — desativar ou excluir produto.
- Endpoint para categorias, caso as categorias deixem de ser definidas
  diretamente no frontend.
- Suporte para foto, preparo, rendimento e ingredientes, caso esses campos
  façam parte do produto persistido.

### Vendas e pedidos

- `GET /vendas/{id}` — obter os detalhes de uma venda, incluindo seus itens.
- `PATCH /vendas/{id}` — alterar o status ou outros dados da venda, se essa
  regra for necessária.
- `DELETE /vendas/{id}` — cancelar uma venda, incluindo a reversão do estoque.
- Filtros e paginação para `GET /vendas`.
- Dados agregados por cliente, como total gasto, ticket médio, último pedido e
  histórico de pedidos. A tela de detalhe do cliente não consegue preencher
  essas informações usando apenas `GET /clientes`.
- `GET /clientes/{id}/resumo` — resumo do cliente para a listagem e o detalhe,
  contendo `totalGasto`, `quantidadePedidos`, `ultimoPedido` e pendências de
  pagamento/encomenda. Enquanto esse contrato não existir, a tela exibe os
  campos sem valor e não apresenta alertas de indisponibilidade.
- `PATCH /clientes/{id}/observacao` — salvar automaticamente a observação
  editada na tela de detalhe do cliente. A tela atualiza o valor localmente
  enquanto esse endpoint não existir; a persistência no banco ainda depende
  desse contrato.

## Contratos que precisam de alinhamento

- O dashboard retorna `alertas[].tipo` como `ESTOQUE_BAIXO`, enquanto o
  frontend atualmente utiliza tipos visuais como `critico`, `aviso` e
  `informativo`.
- `GET /vendas` retorna `status: "CONCLUIDA"`, mas a tela atual trabalha com
  `pago` e `pendente`.
- `GET /vendas` não retorna os itens da venda; a tela de detalhe precisa de
  `GET /vendas/{id}` ou de uma alteração no contrato atual.
- O cadastro de produto da tela possui campos que não existem no endpoint atual:
  `foto`, `preparo`, `rendimento` e `ingredientes`.
- O endpoint `POST /produtos` exige `precoCusto` e `estoque`, campos que
  precisam estar disponíveis na tela ou receber uma regra de negócio definida.
- A API permite somente uma conta de responsável. O frontend deve tratar
  `409 Conflict` como conflito de cadastro, não como erro genérico.

## Ordem sugerida para novas telas

1. Dashboard e filtros de período.
2. Listagem e cadastro de produtos.
3. Clientes usados no fluxo de cobrança.
4. Cadastro de vendas.
5. Listagem de vendas.
6. Detalhe de venda, após existir um endpoint específico.
7. Perfil e configurações, após a API definir o contrato de usuário.

Ao implementar uma nova tela, verificar primeiro se o endpoint correspondente
está documentado na especificação da API. Se não estiver, registrar a
necessidade neste arquivo antes de criar uma integração simulada.
