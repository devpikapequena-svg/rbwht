// src/lib/utmifyService.ts
import { UtmifyOrderPayload } from '@/interfaces/utmify'
import axios from 'axios'

// ❌ remove getConfig / serverRuntimeConfig
// import getConfig from 'next/config'
// const { serverRuntimeConfig } = getConfig()

// ✅ usa direto as envs
const UTMIFY_API_URL = process.env.UTMIFY_API_URL
const UTMIFY_API_TOKEN = process.env.UTMIFY_API_TOKEN

export async function sendOrderToUtmify(
  payload: UtmifyOrderPayload,
): Promise<any> {
  console.log(
    '[UtmifyService] Verificando token. Valor do UTMIFY_API_TOKEN:',
    UTMIFY_API_TOKEN ? 'Token carregado' : 'Token não carregado ou vazio',
  )
  console.log(
    '[UtmifyService] URL configurada:',
    UTMIFY_API_URL || 'URL não configurada',
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
    const response = await axios.post(UTMIFY_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': UTMIFY_API_TOKEN,
        'User-Agent': 'RecargaJogo/1.0',
      },
    })

    console.log(
      `[UtmifyService] ✅ Sucesso! Resposta da Utmify (Status: ${response.status}):`,
      response.data,
    )
    return response.data
  } catch (error: any) {
    let errorMessage = 'Erro desconhecido ao comunicar com a Utmify.'

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Erro da API Utmify: ${error.response.status} - ${JSON.stringify(
          error.response.data,
        )}`
        console.error('[UtmifyService] ❌ Erro de resposta da Utmify:', {
          status: error.response.status,
          data: error.response.data,
        })
      } else if (error.request) {
        errorMessage =
          'Nenhuma resposta recebida da Utmify. Verifique a conectividade.'
        console.error(
          '[UtmifyService] ❌ Nenhuma resposta da Utmify:',
          error.request,
        )
      } else {
        errorMessage = `Erro ao configurar requisição para Utmify: ${error.message}`
        console.error(
          '[UtmifyService] ❌ Erro de configuração da requisição:',
          error.message,
        )
      }
    } else {
      console.error('[UtmifyService] ❌ Erro inesperado:', error)
    }

    throw new Error(errorMessage)
  }
}

export function formatToUtmifyDate(date: Date | null): string | null {
  if (!date) return null
  return date.toISOString().slice(0, 19).replace('T', ' ')
}
