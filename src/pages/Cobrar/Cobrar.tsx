import React, { useCallback, useMemo, useRef, useState } from "react"
import { FlatList, Text, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import ProdutoCard from "../../components/ProdutoCard/"
import Dropdown from "../../components/Dropdown/"
import FormaPagamento, {
    PAGAMENTOS,
    TipoPagamento,
} from "../../components/FormaPagamento/"
import { useNavBar } from "../../contexts/NavBarContext"
import { filtrarProdutos, listarClientes, listarProdutos } from "../../services/produtos"
import type { DropdownOpcao } from "../../components/Dropdown/"
import type { Produto } from "../../types/produto"

export default function Cobrar() {
    const { setCobranca } = useNavBar()

    const [busca, setBusca] = useState("")
    const [quantidades, setQuantidades] = useState<Record<string, number>>({})
    const [cliente, setCliente] = useState<string | null>(null)
    const [pagamento, setPagamento] = useState<TipoPagamento | null>(null)
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([])
    const [clientes, setClientes] = useState<DropdownOpcao[]>([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    const produtos = useMemo(
        () => filtrarProdutos(todosProdutos, busca, "Todos"),
        [todosProdutos, busca]
    )

    const { itens, total } = useMemo(() => {
        let itens = 0
        let total = 0

        for (const p of todosProdutos) {
            const q = quantidades[p.id] ?? 0
            itens += q
            total += q * p.preco
        }

        return { itens, total }
    }, [todosProdutos, quantidades])

    useFocusEffect(
        useCallback(() => {
            let ativo = true

            Promise.all([listarProdutos(), listarClientes()])
                .then(([produtosCarregados, clientesCarregados]) => {
                    if (ativo) {
                        setTodosProdutos(produtosCarregados)
                        setClientes(clientesCarregados)
                        setErro(null)
                        setCarregando(false)
                    }
                })
                .catch((error: unknown) => {
                    if (ativo) {
                        setErro(error instanceof Error ? error.message : "Erro ao carregar dados.")
                        setCarregando(false)
                    }
                })

            return () => {
                ativo = false
            }
        }, [])
    )

    function alterarQuantidade(id: string, quantidade: number) {
        setQuantidades((atual) => ({ ...atual, [id]: quantidade }))
    }

    function cobrar() {
        
    }

    const cobrarRef = useRef(cobrar)
    cobrarRef.current = cobrar

    useFocusEffect(
        useCallback(() => {
            setCobranca({
                itens,
                total,
                desabilitado: itens === 0 || !pagamento,
                onCobrar: () => cobrarRef.current(),
            })

            return () => setCobranca(null)
        }, [itens, total, pagamento, setCobranca])
    )

    return (
        <AppLayout
            header={{
                tipo: "buscaVoltar",
                titulo: "Cobrar pedido",
                busca,
                onChangeBusca: setBusca,
            }}
        >
            <FlatList
                data={produtos}
                keyExtractor={(p) => p.id}
                numColumns={2}
                columnWrapperStyle={style.coluna}
                contentContainerStyle={style.lista}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                    <ProdutoCard
                        tipo="quantidade"
                        produto={item}
                        quantidade={quantidades[item.id] ?? 0}
                        onChangeQuantidade={(q) => alterarQuantidade(item.id, q)}
                    />
                )}
                ListEmptyComponent={
                    <Text style={style.vazio}>
                        {erro ?? (carregando ? "Carregando produtos..." : "Nenhum produto encontrado.")}
                    </Text>
                }
                ListFooterComponent={
                    <View style={style.formulario}>
                        {erro && <Text style={style.vazio}>{erro}</Text>}
                        <Dropdown
                            label="Cliente"
                            placeholder="Selecione o cliente"
                            opcoes={clientes}
                            valor={cliente}
                            onChange={setCliente}
                        />

                        <View style={style.bloco}>
                            <Text style={style.rotulo}>Forma de Pagamento</Text>

                            <View style={style.linhaPagamento}>
                                {PAGAMENTOS.map((tipo) => (
                                    <FormaPagamento
                                        key={tipo}
                                        tipo={tipo}
                                        selecionado={pagamento === tipo}
                                        onPress={() => setPagamento(tipo)}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                }
            />
        </AppLayout>
    )
}