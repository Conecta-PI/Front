import React from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { style, BAR_HEIGHT, TOTAL_HEIGHT } from "./style"
import { themes } from "../../global/themes"

type IconName = React.ComponentProps<typeof Ionicons>["name"]

const TABS: Record<
    string,
    { label: string; icon: IconName; iconAtivo: IconName }
> = {
    Inicio: { label: "Início", icon: "home-outline", iconAtivo: "home" },
    Produtos: { label: "Produtos", icon: "cube-outline", iconAtivo: "cube" },
    Cobrar: { label: "Cobrar", icon: "qr-code-outline", iconAtivo: "qr-code" },
    Pedidos: { label: "Pedidos", icon: "clipboard-outline", iconAtivo: "clipboard" },
    Mais: { label: "Mais", icon: "ellipsis-horizontal", iconAtivo: "ellipsis-horizontal" },
}

export default function NavBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets()

    return (
        <View style={[style.container, { height: TOTAL_HEIGHT + insets.bottom }]}>
            <View style={[style.bar, { height: BAR_HEIGHT + insets.bottom }]} />

            <View style={[style.row, { height: TOTAL_HEIGHT }]}>
                {state.routes.map((route, index) => {
                    const tab = TABS[route.name]
                    if (!tab) return null

                    const focused = state.index === index
                    const isCenter = route.name === "Cobrar"

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        })

                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name as never)
                        }
                    }

                    const corIcone = focused
                        ? themes.colors["branco"]
                        : themes.colors["borda"]

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            accessibilityRole="button"
                            accessibilityState={focused ? { selected: true } : {}}
                            accessibilityLabel={tab.label}
                            style={style.item}
                        >
                            {({ pressed }) => (
                                <>
                                    {isCenter ? (
                                        <View
                                            style={[
                                                style.centerButton,
                                                pressed && style.centerButtonPressed,
                                            ]}
                                        >
                                            <Ionicons
                                                name={focused ? tab.iconAtivo : tab.icon}
                                                size={28}
                                                color={themes.colors["azul-escuro"]}
                                            />
                                        </View>
                                    ) : (
                                        <Ionicons
                                            name={focused ? tab.iconAtivo : tab.icon}
                                            size={22}
                                            color={corIcone}
                                        />
                                    )}

                                    <Text
                                        style={[
                                            style.label,
                                            focused ? style.labelAtivo : style.labelInativo,
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>

                                    <View style={[style.dot, !focused && style.dotOculto]} />
                                </>
                            )}
                        </Pressable>
                    )
                })}
            </View>

            <View style={{ height: insets.bottom }} />
        </View>
    )
}