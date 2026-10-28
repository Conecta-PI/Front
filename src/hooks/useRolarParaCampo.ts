import { useRef } from "react"
import type { ComponentRef } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native"

export type CampoRef = ComponentRef<typeof View>
type ScrollRef = ComponentRef<typeof ScrollView>

export function useRolarParaCampo() {
    const scrollRef = useRef<ScrollRef>(null)
    const areaRef = useRef<CampoRef>(null)
    const scrollY = useRef(0)

    function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
        scrollY.current = e.nativeEvent.contentOffset.y
    }

    function rolarPara(campo: CampoRef | null) {
        if (!campo) return

        setTimeout(() => {
            areaRef.current?.measureInWindow((_x: number, topoArea: number) => {
                campo.measureInWindow((_x2: number, y: number) => {
                    scrollRef.current?.scrollTo({
                        y: Math.max(0, scrollY.current + (y - topoArea) - 24),
                        animated: true,
                    })
                })
            })
        }, 150)
    }

    return { scrollRef, areaRef, onScroll, rolarPara }
}