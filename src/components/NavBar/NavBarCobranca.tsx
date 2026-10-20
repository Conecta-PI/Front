import React from "react"
import { Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style } from "./style"
import Button from "../Button/Button"
import { formatarMoeda } from "../../utils/formataMoeda"
import type { RodapeCobranca } from "../../contexts/NavBarContext"

export default function NavBarCobranca({
    itens,
    total,
    desabilitado,
    onCobrar,
}: RodapeCobranca) {
    const insets = useSafeAreaInsets()

    return (
        <View style={[style.cobranca, { paddingBottom: 16 + insets.bottom }]}>
            <View style={style.cobrancaResumo}>
                <Text style={style.cobrancaItens}>
                    {itens} {itens === 1 ? "item selecionado" : "itens selecionados"}
                </Text>

                <Text style={style.cobrancaRotuloTotal}>
                    Total: <Text style={style.cobrancaTotal}>{formatarMoeda(total)}</Text>
                </Text>
            </View>

            <Button
                texto={`Cobrar ${formatarMoeda(total)}`}
                disabled={desabilitado}
                onPress={onCobrar}
            />
        </View>
    )
}