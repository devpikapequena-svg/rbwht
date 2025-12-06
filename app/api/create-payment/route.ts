'use server';

import { NextRequest, NextResponse } from 'next/server';
import { gerarCPFValido } from '@/lib/utils';
import { sendOrderToUtmify, formatToUtmifyDate } from '@/lib/utmifyService';
import { UtmifyOrderPayload } from '@/interfaces/utmify';
import { PaymentPayload } from '@/interfaces/types';

/**
 * Notifica o Discord sobre um novo pedido criado
 */
async function notifyDiscordPaymentCreated(data: {
  id: string;
  name: string;
  email: string;
  amount: number; // centavos
}) {
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!discordWebhookUrl) return;

  const valorReais = (data.amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const embed = {
    embeds: [
      {
        title: '🧾 Novo pedido gerado',
        color: 0xcc712e,
        fields: [
          { name: 'Pedido', value: data.id, inline: false },
          { name: 'Cliente', value: data.name, inline: true },
          { name: 'Email', value: data.email, inline: true },
          { name: 'Valor', value: valorReais, inline: true },
          {
            name: 'Data',
            value: new Date().toLocaleString('pt-BR'),
            inline: true,
          },
        ],
        footer: { text: 'Oferta • BuckPay' },
      },
    ],
  };

  try {
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    });
  } catch (err) {
    console.error('Erro ao enviar webhook do pagamento:', err);
  }
}

/**
 * Criação de pagamento
 */
export async function POST(request: NextRequest) {
  let requestBody: PaymentPayload;

  try {
    requestBody = await request.json();

    const { name, email, phone, amount, items, externalId, utmQuery } =
      requestBody;

    const apiToken = process.env.BUCKPAY_API_TOKEN;
    if (!apiToken) {
      console.error('❌ Variável BUCKPAY_API_TOKEN ausente.');
      return new NextResponse(
        JSON.stringify({ error: 'Configuração do servidor incompleta.' }),
        { status: 500 }
      );
    }

    const parsedAmount = parseFloat(String(amount));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Valor do pagamento inválido.' }),
        { status: 400 }
      );
    }
    const amountInCents = Math.round(parsedAmount * 100);

    if (!Array.isArray(items) || items.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Itens do pedido inválidos.' }),
        { status: 400 }
      );
    }

    const finalCpf = (requestBody.cpf || gerarCPFValido()).replace(/\D/g, '');
    const utmParams = utmQuery || {};
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

const payloadForBuckPay = {
  external_id: externalId,
  payment_method: 'pix',
  amount: amountInCents,
  buyer: {
    name,
    email,
    document: finalCpf,
    phone:
      phone && phone.trim() !== ""
        ? `55${phone.replace(/\D/g, '').slice(0, 11)}`
        : "5511999999999", // fallback padrão
    ip,
  },
  items: items.map((item: any) => ({
    id: item.id || `prod_${Date.now()}`,
    name: item.title,
    amount: Math.round(item.unitPrice * 100),
    quantity: item.quantity,
  })),
  tracking: {
    ref: utmParams['ref'] || null,
    src: utmParams['src'] || utmParams['utm_source'] || null,
    sck: utmParams['sck'] || null,
    utm_source: utmParams['utm_source'] || null,
    utm_medium: utmParams['utm_medium'] || null,
    utm_campaign: utmParams['utm_campaign'] || null,
    utm_id: utmParams['utm_id'] || null,
    utm_term: utmParams['utm_term'] || null,
    utm_content: utmParams['utm_content'] || null,
  },
};

    const buckpayResponse = await fetch(
      'https://api.realtechdev.com.br/v1/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
          'User-Agent': 'Buckpay API',
        },
        body: JSON.stringify(payloadForBuckPay),
      }
    );

    const responseData = await buckpayResponse.json();

    if (!buckpayResponse.ok) {
      return new NextResponse(
        JSON.stringify({
          error: responseData.error?.message || 'Falha na BuckPay.',
          details: responseData.error?.detail,
        }),
        { status: buckpayResponse.status }
      );
    }

    const buckpayData = responseData.data;
    if (buckpayData && buckpayData.id) {
      await notifyDiscordPaymentCreated({
        id: buckpayData.id,
        name,
        email,
        amount: amountInCents,
      });

      const utmifyPayload: UtmifyOrderPayload = {
        orderId: buckpayData.id,
        platform: 'RecargaJogo',
        paymentMethod: 'pix',
        status: 'waiting_payment',
        createdAt: formatToUtmifyDate(new Date()),
        approvedDate: null,
        refundedAt: null,
        customer: {
          name,
          email,
          phone: phone.replace(/\D/g, ''),
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
      };

      try {
        await sendOrderToUtmify(utmifyPayload);
      } catch (utmifyError: any) {
        console.error(
          `Erro ao enviar pedido pendente ${buckpayData.id} para Utmify:`,
          utmifyError
        );
      }
    }

    return new NextResponse(JSON.stringify(responseData), { status: 200 });
  } catch (error: any) {
    console.error('[create-payment POST] Erro fatal:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}

/**
 * Consulta status de pagamento
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get('externalId');

  if (!externalId) {
    return new NextResponse(
      JSON.stringify({ error: 'externalId é obrigatório.' }),
      { status: 400 }
    );
  }

  try {
    const apiToken = process.env.BUCKPAY_API_TOKEN;
    if (!apiToken) {
      return new NextResponse(
        JSON.stringify({ error: 'Configuração do servidor incompleta.' }),
        { status: 500 }
      );
    }

    const buckpayStatusResponse = await fetch(
      `https://api.realtechdev.com.br/v1/transactions/external_id/${externalId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Buckpay API',
        },
      }
    );

    if (buckpayStatusResponse.status === 404) {
      return new NextResponse(JSON.stringify({ status: 'PENDING' }), {
        status: 200,
      });
    }

    const statusData = await buckpayStatusResponse.json();

    if (!buckpayStatusResponse.ok) {
      return new NextResponse(
        JSON.stringify({
          error: statusData.error?.message || 'Falha ao consultar status.',
          details: statusData.error?.detail,
        }),
        { status: buckpayStatusResponse.status }
      );
    }

    const paymentStatus =
      statusData.data?.status?.toUpperCase() || 'UNKNOWN';

    return new NextResponse(JSON.stringify({ status: paymentStatus }), {
      status: 200,
    });
  } catch (error: any) {
    console.error('[create-payment GET] Erro interno:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}