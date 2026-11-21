import React from "react"
import { ScrollView, Text, View } from "react-native"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import AppLayout from "../../components/AppLayout/AppLayout"
import Button from "../../components/Button/Button"
import type { RootStackParamList } from "../../routes"

export default function TermosUso() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const route = useRoute<RouteProp<RootStackParamList, "TermosUso">>()
    const insets = useSafeAreaInsets()

    function aceitar() {
        route.params.onAceitar()
        navigation.goBack()
    }

    return (
        <AppLayout header={{ tipo: "detalhe", titulo: "Termos de uso" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[style.conteudo, { paddingBottom: 24 + insets.bottom }]}
            >
                <Text style={style.titulo}>Termos de uso do Conecta</Text>

                <View style={style.secao}>
                    <Text style={style.subtitulo}>1. Uso da plataforma</Text>
                    <Text style={style.texto}>
                        Ao criar uma conta, você declara que possui autorização para utilizar os dados informados
                        e se compromete a usar o Conecta de forma lícita e responsável.
                    </Text>
                </View>

                <View style={style.secao}>
                    <Text style={style.subtitulo}>2. Cadastro e segurança</Text>
                    <Text style={style.texto}>
                        Você é responsável por manter a confidencialidade da sua senha e por todas as atividades
                        realizadas na conta. Não compartilhe suas credenciais com terceiros.
                    </Text>
                </View>

                <View style={style.secao}>
                    <Text style={style.subtitulo}>3. Dados e privacidade</Text>
                    <Text style={style.texto}>
                        Os dados cadastrados serão utilizados para operar os recursos do aplicativo, como gestão de
                        clientes, produtos, vendas, encomendas e financeiro.
                    </Text>
                </View>

                <View style={style.secao}>
                    <Text style={style.subtitulo}>4. Responsabilidades</Text>
                    <Text style={style.texto}>
                        As informações registradas devem ser precisas e atualizadas. O usuário responde pelas
                        informações financeiras e comerciais cadastradas no sistema.
                    </Text>
                </View>

                <View style={style.secao}>
                    <Text style={style.subtitulo}>5. Encerramento</Text>
                    <Text style={style.texto}>
                        O acesso pode ser encerrado em caso de uso indevido da plataforma ou descumprimento destes
                        termos.
                    </Text>
                </View>

                <Button texto="Li e aceito os termos" onPress={aceitar} />
            </ScrollView>
        </AppLayout>
    )
}
