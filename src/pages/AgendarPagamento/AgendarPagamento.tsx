
import React, { useMemo, useState } from "react"
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import type { TipoEntrega } from "../../types/encomenda"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type AgendarPagamentoProps = {
    total: number
    clienteNome: string
    onVoltar: () => void
    onConfirmar: (
        dataEscolhida: Date,
        horario: string,
        tipoEntrega: TipoEntrega,
        sinalPago: number
    ) => void
    onTrocarForma: () => void
}

type DataPagamento = {
    data: Date
    semana: string
}

const DIAS_DA_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function criarDatasDaSemana(): DataPagamento[] {
    const amanha = new Date()
    amanha.setHours(12, 0, 0, 0)
    amanha.setDate(amanha.getDate() + 1)

    return Array.from({ length: 7 }, (_, indice) => {
        const data = new Date(amanha)
        data.setDate(amanha.getDate() + indice)

        return {
            data,
            semana: DIAS_DA_SEMANA[data.getDay()],
        }
    })
}

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, "0")}/${String(
        data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`
}

export default function AgendarPagamento({
    total,
    clienteNome,
    onVoltar,
    onConfirmar,
    onTrocarForma,
}: AgendarPagamentoProps) {
    const datas = useMemo(criarDatasDaSemana, [])

    const [dataEscolhida, setDataEscolhida] = useState(
        datas[0].data.getTime()
    )
    const [horario, setHorario] = useState("10:00")
    const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null)
    const [sinalTexto, setSinalTexto] = useState("")

    function confirmar() {
        if (!tipoEntrega) {
            Alert.alert(
                "Tipo de recebimento",
                "Selecione se a encomenda será retirada ou entregue."
            )
            return
        }

        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
            Alert.alert(
                "Horário inválido",
                "Informe um horário válido no formato HH:mm. Exemplo: 14:30."
            )
            return
        }

        const sinalNormalizado = sinalTexto.trim().replace(",", ".")
        const sinalPago =
            sinalNormalizado === "" ? 0 : Number(sinalNormalizado)

        if (!Number.isFinite(sinalPago) || sinalPago < 0) {
            Alert.alert(
                "Sinal inválido",
                "Informe um valor válido para o sinal pago."
            )
            return
        }

        if (sinalPago > total) {
            Alert.alert(
                "Valor inválido",
                "O sinal pago não pode ser maior que o valor total da encomenda."
            )
            return
        }

        onConfirmar(
            new Date(dataEscolhida),
            horario,
            tipoEntrega,
            sinalPago
        )
    }

    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Agendar encomenda",
                onVoltar,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                <View style={style.card}>
                    <Text style={style.rotulo}>Valor total da encomenda</Text>
                    <Text style={style.valor}>{formatarMoeda(total)}</Text>

                    <View style={style.linhaCliente}>
                        <Text style={style.rotulo}>Cliente</Text>
                        <Text style={style.cliente}>
                            {clienteNome || "Cliente não informado"}
                        </Text>
                    </View>
                </View>

                <View style={style.card}>
                    <Text style={style.tituloCard}>
                        Data de entrega ou retirada
                    </Text>

                    <View style={style.datas}>
                        {datas.map(({ data, semana }) => {
                            const selecionada =
                                data.getTime() === dataEscolhida

                            return (
                                <Pressable
                                    key={data.getTime()}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected: selecionada,
                                    }}
                                    onPress={() =>
                                        setDataEscolhida(data.getTime())
                                    }
                                    style={[
                                        style.data,
                                        selecionada && style.dataSelecionada,
                                    ]}
                                >
                                    <Text style={style.dataSemana}>
                                        {semana}
                                    </Text>
                                    <Text style={style.dataDia}>
                                        {data.getDate()}
                                    </Text>
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

                <View style={style.card}>
                    <Text style={style.tituloCard}>
                        Horário combinado
                    </Text>

                    <TextInput
                        style={style.campoTexto}
                        value={horario}
                        onChangeText={setHorario}
                        placeholder="Ex.: 14:30"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        autoCorrect={false}
                    />

                    <Text style={style.rotulo}>
                        Informe o horário combinado com o cliente.
                    </Text>
                </View>

                <View style={style.card}>
                    <Text style={style.tituloCard}>
                        Tipo de recebimento
                    </Text>

                    <View style={style.opcoesEntrega}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{
                                selected: tipoEntrega === "retirada",
                            }}
                            onPress={() => setTipoEntrega("retirada")}
                            style={[
                                style.opcaoEntrega,
                                tipoEntrega === "retirada" &&
                                style.opcaoEntregaSelecionada,
                            ]}
                        >
                            <Text style={style.textoOpcaoEntrega}>
                                Retirada
                            </Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={{
                                selected: tipoEntrega === "entrega",
                            }}
                            onPress={() => setTipoEntrega("entrega")}
                            style={[
                                style.opcaoEntrega,
                                tipoEntrega === "entrega" &&
                                style.opcaoEntregaSelecionada,
                            ]}
                        >
                            <Text style={style.textoOpcaoEntrega}>
                                Entrega
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={style.card}>
                    <Text style={style.tituloCard}>
                        Sinal pago (opcional)
                    </Text>

                    <TextInput
                        style={style.campoTexto}
                        value={sinalTexto}
                        onChangeText={(texto) =>
                            setSinalTexto(texto.replace(/[^0-9.,]/g, ""))
                        }
                        placeholder="0,00"
                        keyboardType="decimal-pad"
                    />

                    <Text style={style.rotulo}>
                        Se o cliente já pagou uma parte, informe o valor.
                        Caso contrário, deixe em branco.
                    </Text>
                </View>

                <View style={style.aviso}>
                    <Text style={style.avisoTexto}>
                        O agendamento será salva na seção Encomendas, sem criar
                        uma venda duplicada. O sinal informado será registrado
                        junto à encomenda.
                    </Text>
                </View>

                <Button
                    texto="Confirmar encomenda"
                    onPress={confirmar}
                />

                <Button
                    texto="Trocar forma de pagamento"
                    variante="contorno"
                    cor="azul-escuro"
                    onPress={onTrocarForma}
                />
            </ScrollView>
        </AppLayout>
    )
}
