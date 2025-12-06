'use server'

import { NextRequest, NextResponse } from 'next/server'
import { gerarCPFValido } from '@/lib/utils'
import { PaymentPayload } from '@/interfaces/types'
import { sendOrderToUtmify, formatToUtmifyDate } from '@/lib/utmifyService'
import { UtmifyOrderPayload } from '@/interfaces/utmify'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PaymentPayload

    const { name, email, phone, amount, items, externalId } = body
    const utmParams = (body as any).utmQuery || {} // mesma lógica do Buckpay

    const publicKey = process.env.BLACKCAT_PUBLIC_KEY
    const secretKey = process.env.BLACKCAT_SECRET_KEY

    if (!publicKey || !secretKey) {
      console.error('❌ BLACKCAT_PUBLIC_KEY/BLACKCAT_SECRET_KEY não configuradas')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta.' },
        { status: 500 },
      )
    }

    const authHeader =
      'Basic ' + Buffer.from(`${publicKey}:${secretKey}`).toString('base64')

    const parsedAmount = parseFloat(String(amount))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Valor do pagamento inválido.' },
        { status: 400 },
      )
    }

    const amountInCents = Math.round(parsedAmount * 100)

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Itens do pedido inválidos.' },
        { status: 400 },
      )
    }

    const finalCpf = (body.cpf || gerarCPFValido()).replace(/\D/g, '')

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      '127.0.0.1'

    // ------------------------------
    //     PAYLOAD PARA BLACKCAT
    // ------------------------------
    const payloadForBlackcat = {
      amount: amountInCents,
      currency: 'BRL',
      paymentMethod: 'pix',
      pix: {
        expiresInDays: 1,
      },
      items: items.map((item: any) => ({
        title: 'Clash', // 🔒 nome fixo (igual você já tinha)
        unitPrice: Math.round(item.unitPrice * 100),
        quantity: item.quantity || 1,
        tangible: false,
        externalRef: item.id || undefined,
      })),
    customer: {
        name,
        email,
        phone:
          phone && phone.trim() !== ''
            ? phone.replace(/\D/g, '').slice(-11)
            : undefined,
        document: {
          type: 'cpf',
          number: finalCpf,
        },
      },
      externalRef: externalId,
      ip,
    }

    // ------------------------------
    //     CHAMADA À BLACKCAT
    // ------------------------------
    const resp = await fetch(
      'https://api.blackcatpagamentos.com/v1/transactions',
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payloadForBlackcat),
      },
    )

    const json = await resp.json().catch(() => ({} as any))

    console.log('[BLACKCAT RESPOSTA BRUTA]', json)

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: json?.error || json?.message || 'Erro na adquirente.',
          details: json,
        },
        { status: resp.status },
      )
    }

    // ======================================================
    //    🔥 ENVIO PARA UTMIFY (MESMO PADRÃO DO BUCKPAY)
    // ======================================================

    // A Blackcat pode devolver direto o objeto da transação
    const tx = (json as any)?.data ?? json
    const blackcatOrderId: string =
      (tx && tx.id ? String(tx.id) : externalId) || externalId

    const utmifyPayload: UtmifyOrderPayload = {
      orderId: blackcatOrderId,
      platform: 'RecargaJogo',
      paymentMethod: 'pix',
      status: 'waiting_payment',
      createdAt: formatToUtmifyDate(new Date()),
      approvedDate: null,
      refundedAt: null,

      customer: {
        name,
        email,
        phone: phone?.replace(/\D/g, '') || '',
        document: finalCpf,
        country: 'BR',
        ip,
      },

      products: items.map((item: any) => ({
        id: item.id || `prod_${Date.now()}`,
        name: item.title,
        planId: null,
        planName: null,
        quantity: item.quantity,
        priceInCents: Math.round(item.unitPrice * 100),
      })),

      trackingParameters: {
        src: utmParams['src'] || utmParams['utm_source'] || null,
        sck: utmParams['sck'] || null,
        utm_source: utmParams['utm_source'] || null,
        utm_campaign: utmParams['utm_campaign'] || null,
        utm_medium: utmParams['utm_medium'] || null,
        utm_content: utmParams['utm_content'] || null,
        utm_term: utmParams['utm_term'] || null,
      },

      commission: {
        totalPriceInCents: amountInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: amountInCents,
        currency: 'BRL',
      },

      isTest: false,
    }

    try {
      await sendOrderToUtmify(utmifyPayload)
    } catch (utmifyError: any) {
      console.error(
        `Erro ao enviar pedido pendente ${blackcatOrderId} para Utmify:`,
        utmifyError,
      )
    }

    // 🔥 DEVOLVE O PIX PARA O FRONT
    return NextResponse.json(json, { status: 200 })
  } catch (err: any) {
    console.error('[create-payment POST] Erro fatal:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}

/**
 * Consulta status de pagamento (pode deixar simples por enquanto)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const externalId = searchParams.get('externalId')

  if (!externalId) {
    return NextResponse.json(
      { error: 'externalId é obrigatório.' },
      { status: 400 },
    )
  }

  try {
    const publicKey = process.env.BLACKCAT_PUBLIC_KEY
    const secretKey = process.env.BLACKCAT_SECRET_KEY

    if (!publicKey || !secretKey) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta.' },
        { status: 500 },
      )
    }

    const authHeader =
      'Basic ' + Buffer.from(`${publicKey}:${secretKey}`).toString('base64')

    const resp = await fetch(
      `https://api.blackcatpagamentos.com/v1/transactions?externalRef=${encodeURIComponent(
        externalId,
      )}`,
      {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
      },
    )

    const json = await resp.json().catch(() => ({} as any))

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: json?.error || json?.message || 'Falha ao consultar status.',
          details: json,
        },
        { status: resp.status },
      )
    }

    const tx =
      Array.isArray(json?.data) && json.data.length > 0 ? json.data[0] : json

    const paymentStatus = (tx.status || 'UNKNOWN').toUpperCase()

    return NextResponse.json(
      { status: paymentStatus, raw: json },
      { status: 200 },
    )
  } catch (err: any) {
    console.error('[create-payment GET] Erro interno:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
