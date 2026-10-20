import React, { ReactNode, createContext, useContext, useMemo, useState } from "react"

export type RodapeCobranca = {
    itens: number
    total: number
    desabilitado?: boolean
    onCobrar: () => void
}

type NavBarContextValue = {
    cobranca: RodapeCobranca | null
    setCobranca: (valor: RodapeCobranca | null) => void
}

const NavBarContext = createContext<NavBarContextValue>({
    cobranca: null,
    setCobranca: () => {},
})

export function NavBarProvider({ children }: { children: ReactNode }) {
    const [cobranca, setCobranca] = useState<RodapeCobranca | null>(null)
    const value = useMemo(() => ({ cobranca, setCobranca }), [cobranca])

    return <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>
}

export const useNavBar = () => useContext(NavBarContext)