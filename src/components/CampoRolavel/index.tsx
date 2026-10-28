import React, { useRef } from "react"
import { View } from "react-native"

import Input, { InputProps } from "../Input/Input"
import type { CampoRef } from "../../hooks/useRolarParaCampo"

type CampoRolavelProps = InputProps & {
    aoFocar: (campo: CampoRef | null) => void
}

export default function CampoRolavel({ aoFocar, onFocus, ...props }: CampoRolavelProps) {
    const ref = useRef<CampoRef>(null)

    return (
        <View ref={ref} collapsable={false}>
            <Input
                {...props}
                onFocus={(e) => {
                    onFocus?.(e)
                    aoFocar(ref.current)
                }}
            />
        </View>
    )
}