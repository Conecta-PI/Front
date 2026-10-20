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
import { CLIENTES, filtrarProdutos, listarProdutos } from "../../services/produtos"

export default function Cobrar() {
    const { setCobranca } = useNavBar()

    const [busca, setBusca] = useState("")
    const [quantidades, setQuantidades] = useState<Record<string, number>>({})
    const [cliente, setCliente] = useState<string | null>(null)
    const [pagamento, setPagamento] = useState<TipoPagamento | null>(null)

    const produtos = useMemo(() => filtrarProdutos(busca, "Todos"), [busca])

    const { itens, total } = useMemo(() => {
        let itens = 0
        let total = 0

        for (const p of listarProdutos()) {
            const q = quantidades[p.id] ?? 0
            itens += q
            total += q * p.preco
        }

        return { itens, total }
    }, [quantidades])

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
                    <Text style={style.vazio}>Nenhum produto encontrado.</Text>
                }
                ListFooterComponent={
                    <View style={style.formulario}>
                        <Dropdown
                            label="Cliente"
                            placeholder="Selecione o cliente"
                            opcoes={CLIENTES}
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