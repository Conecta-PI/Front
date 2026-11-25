
import React from "react"
import { ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import type { TipoEntrega } from "../../types/encomenda"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type AgendamentoConfirmadoProps = {
    encomendaId: string
    clienteNome: string
    total: number
    dataEscolhida: Date
    horario: string
    tipoEntrega: TipoEntrega
    sinalPago: number
    quantidadeItens: number
    onVerEncomendas: () => void
    onNovaVenda: () => void
}

function formatarData(data: Date) {
    return `${String(data.getDate()).padStart(2, "0")}/${String(
        data.getMonth() + 1
    ).padStart(2, "0")}/${data.getFullYear()}`
}

export default function AgendamentoConfirmado({
    encomendaId,
    clienteNome,
    total,
    dataEscolhida,
    horario,
    tipoEntrega,
    sinalPago,
    quantidadeItens,
    onVerEncomendas,
    onNovaVenda,
}: AgendamentoConfirmadoProps) {
    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Encomenda confirmada",
                onVoltar: onVerEncomendas,
            }}
        >
            <ScrollView
                style={style.scroll}
                contentContainerStyle={style.conteudo}
                showsVerticalScrollIndicator={false}
            >
                <View style={style.icone}>
                    <Text style={style.iconeTexto}>✓</Text>
                </View>

                <Text style={style.titulo}>
                    Encomenda agendada!
                </Text>

                <Text style={style.descricao}>
                    A encomenda foi salva com sucesso e já está disponível
                    na seção Encomendas.
                </Text>

                <View style={style.card}>
                    <View style={style.linha}>
                        <Text style={style.rotulo}>Código da encomenda</Text>
                        <Text style={style.valorLinha}>
                            #{encomendaId}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Cliente</Text>
                        <Text style={style.valorLinha}>
                            {clienteNome}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Valor total</Text>
                        <Text style={style.valorLinha}>
                            {formatarMoeda(total)}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Data</Text>
                        <Text style={style.valorLinha}>
                            {formatarData(dataEscolhida)}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Horário</Text>
                        <Text style={style.valorLinha}>
                            {horario}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Recebimento</Text>
                        <Text style={style.valorLinha}>
                            {tipoEntrega === "retirada"
                                ? "Retirada"
                                : "Entrega"}
                        </Text>
                    </View>

                    {sinalPago > 0 && (
                        <View style={style.linha}>
                            <Text style={style.rotulo}>Sinal pago</Text>
                            <Text style={style.valorLinha}>
                                {formatarMoeda(sinalPago)}
                            </Text>
                        </View>
                    )}

                    <View style={style.divisor} />

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Quantidade de itens</Text>
                        <Text style={style.valorLinha}>
                            {quantidadeItens}
                        </Text>
                    </View>

                    <View style={style.linha}>
                        <Text style={style.rotulo}>Status</Text>
                        <View style={style.status}>
                            <Text style={style.statusTexto}>
                                Pendente
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={style.acoes}>
                    <Button
                        texto="Ver encomendas"
                        onPress={onVerEncomendas}
                    />

                    <Button
                        texto="Nova cobrança"
                        variante="contorno"
                        cor="azul-escuro"
                        onPress={onNovaVenda}
                    />
                </View>
            </ScrollView>
        </AppLayout>
    )
}
