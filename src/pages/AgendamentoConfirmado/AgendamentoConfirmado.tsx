import React from "react"
import { ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type AgendamentoConfirmadoProps = {
    total: number
    dataEscolhida: Date
    onVerPendentes: () => void
    onNovaVenda: () => void
}

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(
        2,
        "0"
    )}/${data.getFullYear()}`
}

export default function AgendamentoConfirmado({
    total,
    dataEscolhida,
    onVerPendentes,
    onNovaVenda,
}: AgendamentoConfirmadoProps) {
    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Pagamento agendado",
                semVoltar: true,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.conteudo}
            >
                <View style={style.icone}>
                    <Text style={style.iconeTexto}>✓</Text>
                </View>

                <Text style={style.titulo}>Pagamento agendado!</Text>
                <Text style={style.descricao}>
                    Você será lembrado no dia combinado para receber este valor.
                </Text>

                <View style={style.card}>
                    <Linha rotulo="Cliente" valor="Cliente não informado" />
                    <Linha rotulo="Valor" valor={formatarMoeda(total)} />
                    <Linha rotulo="Data combinada" valor={formatarData(dataEscolhida)} />

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Status</Text>
                        <View style={style.status}>
                            <Text style={style.statusTexto}>Pagamento pendente</Text>
                        </View>
                    </View>

                    <View style={style.divisor} />
                    <Text style={style.itens}>Itens</Text>
                </View>

                <View style={style.acoes}>
                    <Button
                        texto="Ver pagamentos pendentes"
                        cor="dourado"
                        onPress={onVerPendentes}
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

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
    return (
        <View style={style.linha}>
            <Text style={style.rotulo}>{rotulo}</Text>
            <Text style={style.valorLinha}>{valor}</Text>
        </View>
    )
}
