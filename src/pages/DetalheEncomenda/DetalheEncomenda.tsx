
import React from "react"
import { RouteProp, useRoute } from "@react-navigation/native"

import TelaEmConstrucao from "../../components/TelaEmConstrucao/"
import type { RootStackParamList } from "../../routes"

export default function DetalheEncomenda() {
    const { params } = useRoute<RouteProp<RootStackParamList, "DetalheEncomenda">>()

    return <TelaEmConstrucao titulo={`Encomenda #${params.id}`} />
}