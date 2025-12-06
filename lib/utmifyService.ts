// src/lib/utmifyService.ts
import { UtmifyOrderPayload } from '@/interfaces/utmify'

/**
 * Lê as variáveis diretamente do process.env
 * (carregadas do .env/.env.local no servidor).
 */
const UTMIFY_API_URL = process.env.UTMIFY_API_URL
const UTMIFY_API_TOKEN = process.env.UTMIFY_API_TOKEN

/**
 * Envia dados de pedido para a API da UTMify.
 *
 * @param payload O payload do pedido no formato UtmifyOrderPayload.
 * @returns A resposta da API da UTMify.
 * @throws Um erro se a comunicação com a API da UTMify falhar.
 */
export async function sendOrderToUtmify(
  payload: UtmifyOrderPayload,
): Promise<any> {
  console.log(
    '[UtmifyService] Verificando token. Valor do UTMIFY_API_TOKEN:',
    UTMIFY_API_TOKEN ? 'Token carregado' : 'Token não carregado ou vazio',
  )
  console.log(
    '[UtmifyService] URL configurada:',
    UTMIFY_API_URL || 'NÃO CONFIGURADA',
  )

  if (!UTMIFY_API_TOKEN || !UTMIFY_API_URL) {
    const errorMessage =
      'Credenciais da Utmify (UTMIFY_API_URL ou UTMIFY_API_TOKEN) não estão configuradas no servidor.'
    console.error(`[UtmifyService] ${errorMessage}`)
    throw new Error(errorMessage)
  }

  console.log(
    '[UtmifyService] 📤 Enviando payload para Utmify:',
    JSON.stringify(payload, null, 2),
  )

  try {
    const resp = await fetch(UTMIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': UTMIFY_API_TOKEN!,
        'User-Agent': 'RecargaJogo/1.0',
      },
      body: JSON.stringify(payload),
    })

    const data = await resp.json().catch(() => ({} as any))

    if (!resp.ok) {
      console.error(
        `[UtmifyService] ❌ Erro da API Utmify (status ${resp.status}):`,
        data,
      )
      throw new Error(
        data?.message ||
          data?.error ||
          `Erro da API Utmify: status ${resp.status}`,
      )
    }

    console.log(
      `[UtmifyService] ✅ Sucesso! Resposta da Utmify (Status: ${resp.status}):`,
      data,
    )
    return data
  } catch (error: any) {
    let errorMessage = 'Erro desconhecido ao comunicar com a Utmify.'

    console.error('[UtmifyService] ❌ Erro inesperado:', error)

    if (error instanceof Error && error.message) {
      errorMessage = error.message
    }

    throw new Error(errorMessage)
  }
}

/**
 * Formata um objeto Date para uma string no formato "YYYY-MM-DD HH:MM:SS" (UTC),
 * esperado pela API da UTMify.
 */
export function formatToUtmifyDate(date: Date | null): string | null {
  if (!date) return null
  return date.toISOString().slice(0, 19).replace('T', ' ')
}
