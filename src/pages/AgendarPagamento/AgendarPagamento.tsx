import React, { useMemo, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type AgendarPagamentoProps = {
    total: number
    onVoltar: () => void
    onConfirmar: (dataEscolhida: Date) => void
    onTrocarForma: () => void
}

type DataPagamento = {
    data: Date
    semana: string
}

const DIAS_DA_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function criarDatasDaSemana(): DataPagamento[] {
    const hoje = new Date()
    hoje.setHours(12, 0, 0, 0)

    return Array.from({ length: 7 }, (_, indice) => {
        const data = new Date(hoje)
        data.setDate(hoje.getDate() + indice)
        return { data, semana: DIAS_DA_SEMANA[data.getDay()] }
    })
}

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(
        2,
        "0"
    )}/${data.getFullYear()}`
}

export default function AgendarPagamento({
    total,
    onVoltar,
    onConfirmar,
    onTrocarForma,
}: AgendarPagamentoProps) {
    const datas = useMemo(criarDatasDaSemana, [])
    const [dataEscolhida, setDataEscolhida] = useState(datas[0].data.getTime())

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Agendar pagamento",
                onVoltar,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.conteudo}
            >
                <View style={style.card}>
                    <Text style={style.rotulo}>Valor a cobrar</Text>
                    <Text style={style.valor}>{formatarMoeda(total)}</Text>

                    <View style={style.linhaCliente}>
                        <Text style={style.rotulo}>Cliente</Text>
                        <Text style={style.cliente}>Cliente não informado</Text>
                    </View>
                </View>

                <View style={style.card}>
                    <Text style={style.tituloCard}>Para quando o cliente vai pagar?</Text>

                    <View style={style.datas}>
                        {datas.map(({ data, semana }) => {
                            const selecionada = data.getTime() === dataEscolhida

                            return (
                                <Pressable
                                    key={data.getTime()}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: selecionada }}
                                    onPress={() => setDataEscolhida(data.getTime())}
                                    style={[style.data, selecionada && style.dataSelecionada]}
                                >
                                    <Text style={style.dataSemana}>{semana}</Text>
                                    <Text style={style.dataDia}>{data.getDate()}</Text>
                                </Pressable>
                            )
                        })}
                    </View>

                    <View style={style.dataEscolhida}>
                        <Text style={style.rotulo}>Data escolhida</Text>
                        <Text style={style.dataEscolhidaValor}>
                            {formatarData(new Date(dataEscolhida))}
                        </Text>
                    </View>
                </View>

                <View style={style.aviso}>
                    <Text style={style.avisoTexto}>
                        No dia combinado você recebe um aviso no Painel e na Central de avisos.
                        A venda fica em Pedidos como “Pagamento pendente” até você receber.
                    </Text>
                </View>

                <Button
                    texto="Agendar pagamento"
                    cor="dourado"
                    onPress={() => onConfirmar(new Date(dataEscolhida))}
                    textoEmUmaLinha
                />
                <Button
                    texto="Trocar forma de pagamento"
                    cor="borda"
                    variante="contorno"
                    onPress={onTrocarForma}
                    textoEmUmaLinha
                />
            </ScrollView>
        </AppLayout>
    )
}
