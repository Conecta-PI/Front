import React, { useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { style } from "./style"
import { themes } from "../../global/themes"
import { useDashboard } from "../../hooks/useDashboard"
import type { Periodo } from "../../types/dashboard"
import type { AppParamList, Destino } from "../../routes"

import AppLayout from "../../components/AppLayout/AppLayout"
import SeletorPeriodo from "../../components/SeletorPeriodo/"
import CardRecebido from "../../components/CardRecebido/"
import Secao from "../../components/Secao/"
import AtalhoRapido from "../../components/AtalhoRapido/"
import AlertaAtencao from "../../components/AlertaAtencao/"
import EntregaCard from "../../components/EntregaCard/"
import MetricaCard from "../../components/MetricaCard/"
import GraficoLucroMensal from "../../components/GraficoLucroMensal/"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

const ATALHOS: { icone: IconName; texto: string; destino: Destino }[] = [
    { icone: "add-circle-outline", texto: "Novo produto", destino: "NovoProduto" },
    { icone: "cash-outline", texto: "Cobrar", destino: "Cobrar" },
    { icone: "people-outline", texto: "Clientes", destino: "Clientes" },
    { icone: "calendar-outline", texto: "Encomendas", destino: "Encomendas" },
]

const TITULO_RECEBIDO: Record<Periodo, string> = {
    hoje: "Recebido hoje",
    semana: "Recebido na semana",
    mes: "Recebido no mês",
}

export default function Inicio() {
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    const [periodo, setPeriodo] = useState<Periodo>("hoje")
    const [busca, setBusca] = useState("")
    const { dados, erro } = useDashboard(periodo)

    const alertas = dados?.alertas.filter((a) => a.quantidade > 0) ?? []

    return (
        <AppLayout
            header={{
                tipo: "inicio",
                nome: dados?.usuario.nome,
                negocio: dados?.usuario.negocio,
                busca,
                onChangeBusca: setBusca,
            }}
        >
            {!dados ? (
                <View style={style.carregando}>
                    {erro ? (
                        <Text style={style.erro}>{erro}</Text>
                    ) : (
                        <ActivityIndicator color={themes.colors["dourado"]} size="large" />
                    )}
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={style.conteudo}
                >
                    <SeletorPeriodo valor={periodo} onChange={setPeriodo} />

                    <CardRecebido
                        titulo={TITULO_RECEBIDO[periodo]}
                        valor={dados.recebido.valor}
                        meta={dados.recebido.meta}
                        pedidos={dados.recebido.pedidos}
                        onCobrar={() => navigation.navigate("Cobrar")}
                        onReceber={() => navigation.navigate("Pedidos")}
                    />

                    <Secao titulo="Atalhos rápidos">
                        <View style={style.linha}>
                            {ATALHOS.map((a) => (
                                <AtalhoRapido key={a.texto} {...a} />
                            ))}
                        </View>
                    </Secao>

                    {alertas.length > 0 && (
                        <Secao titulo="Precisa de atenção">
                            <View style={style.listaAlertas}>
                                {alertas.map((a) => (
                                    <AlertaAtencao
                                        key={a.tipo}
                                        tipo={a.tipo}
                                        quantidade={a.quantidade}
                                    />
                                ))}
                            </View>
                        </Secao>
                    )}

                    {dados.proximasEntregas.length > 0 && (
                        <Secao titulo="Próximas entregas">
                            <View style={style.lista}>
                                {dados.proximasEntregas.map((e) => (
                                    <EntregaCard key={e.id} {...e} />
                                ))}
                            </View>
                        </Secao>
                    )}

                    <Secao titulo="Métricas">
                        <View style={style.lista}>
                            <View style={style.linha}>
                                <MetricaCard tipo="lucro" valor={dados.metricas.lucro} />
                                <MetricaCard tipo="custo" valor={dados.metricas.custo} />
                                <MetricaCard tipo="investido" valor={dados.metricas.investido} />
                            </View>

                            <GraficoLucroMensal dados={dados.lucroMensal} />
                        </View>
                    </Secao>
                </ScrollView>
            )}
        </AppLayout>
    )
}