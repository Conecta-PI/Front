import React from "react"
import { ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import type { TipoPagamento } from "../../components/FormaPagamento"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type VendaConfirmadaProps = {
    total: number
    pagamento: Exclude<TipoPagamento, "agendar">
    onVoltar: () => void
    onVerPedidos: () => void
    onNovaVenda: () => void
}

const LABEL_PAGAMENTO: Record<Exclude<TipoPagamento, "agendar">, string> = {
    pix: "PIX",
    cartao: "Cartão",
    dinheiro: "Dinheiro",
}

export default function VendaConfirmada({
    total,
    pagamento,
    onVoltar,
    onVerPedidos,
    onNovaVenda,
}: VendaConfirmadaProps) {
    const agora = new Date()
    const dataHora = `${String(agora.getDate()).padStart(2, "0")}/${String(
        agora.getMonth() + 1
    ).padStart(2, "0")}/${agora.getFullYear()} · ${String(agora.getHours()).padStart(
        2,
        "0"
    )}:${String(agora.getMinutes()).padStart(2, "0")}`

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Recibo da venda",
                onVoltar,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.conteudo}
            >
                <View style={style.icone}>
                    <Text style={style.iconeTexto}>✓</Text>
                </View>

                <Text style={style.titulo}>Pagamento confirmado!</Text>
                <Text style={style.subtitulo}>Pago com {LABEL_PAGAMENTO[pagamento]}</Text>

                <View style={style.card}>
                    <Text style={style.negocio}>Conecta Doces & Naturais</Text>
                    <Text style={style.detalheVenda}>Pedido #1025 · {dataHora}</Text>
                    <View style={style.divisor} />

                    <View style={style.itens}>
                        <Text style={style.itemRotulo}>Itens</Text>
                        <Text style={style.itemTexto}>Venda concluída</Text>
                    </View>

                    <View style={style.divisor} />
                    <Linha rotulo="Valor total" valor={formatarMoeda(total)} destaque />
                    <Linha rotulo="Forma de pagamento" valor={LABEL_PAGAMENTO[pagamento]} />
                    <Linha rotulo="Cliente" valor="Cliente não informado" />
                </View>

                <View style={style.acoes}>
                    <Button
                        texto="Ver pedidos"
                        cor="dourado"
                        onPress={onVerPedidos}
                        textoEmUmaLinha
                    />
                    <Button
                        texto="Nova venda"
                        cor="borda"
                        variante="contorno"
                        onPress={onNovaVenda}
                        textoEmUmaLinha
                    />
                </View>
            </ScrollView>
        </AppLayout>
    )
}

function Linha({
    rotulo,
    valor,
    destaque = false,
}: {
    rotulo: string
    valor: string
    destaque?: boolean
}) {
    return (
        <View style={style.linha}>
            <Text style={[style.rotulo, destaque && style.rotuloDestaque]}>{rotulo}</Text>
            <Text style={[style.valor, destaque && style.valorDestaque]}>{valor}</Text>
        </View>
    )
}
