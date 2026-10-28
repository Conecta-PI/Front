
import React, { useState } from "react"
import { Text, View } from "react-native"

import { style } from "./style"
import Input from "../Input/Input"
import Button from "../Button/Button"
import Filtro from "../Filtro/"
import { textoParaNumero } from "../../utils/numeros"
import type { Ingrediente, UnidadePeso } from "../../types/produto"

const UNIDADES: UnidadePeso[] = ["g", "kg"]

type FormIngredienteProps = {
    onAdicionar: (ingrediente: Omit<Ingrediente, "id">) => void
    onCancelar: () => void
}

export default function FormIngrediente({ onAdicionar, onCancelar }: FormIngredienteProps) {
    const [nome, setNome] = useState("")
    const [quantidade, setQuantidade] = useState("")
    const [unidade, setUnidade] = useState<UnidadePeso>("g")
    const [erros, setErros] = useState<{ nome?: string; quantidade?: string }>({})

    function adicionar() {
        const novos: typeof erros = {}
        const valor = textoParaNumero(quantidade)

        if (!nome.trim()) novos.nome = "Informe o nome do ingrediente"
        if (valor <= 0) novos.quantidade = "Informe a quantidade"

        setErros(novos)
        if (Object.keys(novos).length > 0) return

        onAdicionar({ nome: nome.trim(), quantidade: valor, unidade })
    }

    return (
        <View style={style.container}>
            <Input
                tipo="texto"
                label="Nome do ingrediente"
                placeholder="Ex.: Farinha de trigo"
                autoCapitalize="sentences"
                value={nome}
                onChangeText={(t) => {
                    setNome(t)
                    setErros((e) => ({ ...e, nome: undefined }))
                }}
                erro={erros.nome}
            />

            <View style={style.linha}>
                <View style={style.quantidade}>
                    <Input
                        tipo="decimal"
                        label="Quantidade"
                        placeholder="Ex.: 300"
                        value={quantidade}
                        onChangeText={(t) => {
                            setQuantidade(t)
                            setErros((e) => ({ ...e, quantidade: undefined }))
                        }}
                        erro={erros.quantidade}
                    />
                </View>

                <View style={style.unidade}>
                    <Text style={style.rotulo}>Unidade</Text>

                    <View style={style.segmento}>
                        {UNIDADES.map((u) => (
                            <View key={u} style={style.opcao}>
                                <Filtro texto={u} ativo={unidade === u} onPress={() => setUnidade(u)} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <Button texto="Adicionar ingrediente" onPress={adicionar} />
            <Button texto="Cancelar" variante="contorno" cor="borda" onPress={onCancelar} />
        </View>
    )
}