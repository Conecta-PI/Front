import Constants from "expo-constants"
import * as SecureStore from "expo-secure-store"

const host = Constants.expoConfig?.hostUri?.split(":")[0]
const API_BASE_URL = `http://${host ?? "localhost"}:8080/api`
const TOKEN_KEY = "conecta.access-token"
const API_TIMEOUT_MS = 15000

export class ApiError extends Error {
    constructor(message: string, readonly status: number) {
        super(message)
    }
}

export async function salvarToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function limparToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
}

async function requisitar<T>(
    path: string,
    init: RequestInit,
    autenticada: boolean
): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set("Content-Type", "application/json")

    if (autenticada) {
        const token = await SecureStore.getItemAsync(TOKEN_KEY)
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
    let response: Response
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers,
            signal: controller.signal,
        })
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error(
                `A API não respondeu em ${API_TIMEOUT_MS / 1000} segundos. Verifique se o back está ativo e acessível pela rede.`
            )
        }
        throw new Error(
            `Não foi possível acessar a API em ${API_BASE_URL}. Verifique se o back está ativo e se celular e computador estão na mesma rede.`,
            { cause: error }
        )
    } finally {
        clearTimeout(timeoutId)
    }

    if (!response.ok) {
        let message = `A API respondeu com erro (${response.status}).`
        try {
            const body: unknown = await response.json()
            if (body && typeof body === "object") {
                const detail = "detail" in body && typeof body.detail === "string" ? body.detail : null
                const title = "title" in body && typeof body.title === "string" ? body.title : null
                message = detail ?? title ?? message
            }
        } catch {
            // Keep the HTTP status message when the response has no JSON body.
        }
        throw new ApiError(message, response.status)
    }

    return response.json() as Promise<T>
}

export function apiGet<T>(path: string): Promise<T> {
    return requisitar<T>(path, { method: "GET" }, true)
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
    return requisitar<T>(
        path,
        { method: "POST", body: JSON.stringify(body) },
        !path.startsWith("/auth/")
    )
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
    return requisitar<T>(path, { method: "PATCH", body: JSON.stringify(body) }, true)
}

export function apiDelete<T = void>(path: string): Promise<T> {
    return requisitar<T>(path, { method: "DELETE" }, true)
}
