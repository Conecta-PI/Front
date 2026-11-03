import React from "react"
import { ScrollView, Text, View } from "react-native"

import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import { style } from "./style"

type PagamentoCartaoProps = {
    total: number
    onVoltar: () => void
    onConfirmar: () => void
    onTrocarForma: () => void
}

export default function PagamentoCartao({
    total,
    onVoltar,
    onConfirmar,
    onTrocarForma,
}: PagamentoCartaoProps) {
    return (
        <AppLayout
            header={{
                tipo: "detalhe",
                titulo: "Pagamento no cartão",
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
                    <Text style={style.tituloCard}>Como cobrar na maquininha</Text>
                    <View style={style.instrucoes}>
                        <Instrucao numero="1">
                            Digite na maquininha o valor exibido acima.
                        </Instrucao>
                        <Instrucao numero="2">
                            Pergunte ao cliente: débito ou crédito? Escolha a opção na maquininha.
                        </Instrucao>
                        <Instrucao numero="3">
                            Peça para o cliente aproximar ou inserir o cartão e aguarde a aprovação.
                        </Instrucao>
                        <Instrucao numero="4">
                            Com o pagamento aprovado, toque em “Pagamento confirmado”.
                        </Instrucao>
                    </View>
                </View>

                <View style={style.aviso}>
                    <Text style={style.avisoTexto}>
                        Não aparece QR Code no cartão: o pagamento é feito direto na maquininha.
                    </Text>
                </View>

                <Button
                    texto="Pagamento confirmado"
                    cor="dourado"
                    onPress={onConfirmar}
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

function Instrucao({ numero, children }: { numero: string; children: string }) {
    return (
        <View style={style.instrucao}>
            <View style={style.numero}>
                <Text style={style.numeroTexto}>{numero}</Text>
            </View>
            <Text style={style.instrucaoTexto}>{children}</Text>
        </View>
    )
}
