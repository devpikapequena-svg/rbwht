'use server';

import { NextRequest, NextResponse } from 'next/server';

const AMPLPAY_WEBHOOK_TOKEN = process.env.AMPLO_WEBHOOK_TOKEN || 'u3usmdzr';

async function processWebhook(payload: any) {
  const { event, transaction, client } = payload;

  if (!transaction || !client) throw new Error('Payload incompleto');

  if (event === 'TRANSACTION_PAID' && transaction.status === 'COMPLETED') {
    const transactionId = transaction.identifier || transaction.id;

    console.log('Transação PIX paga:', transactionId);
    console.log('Cliente:', client.name, client.email);
    console.log('Valor:', transaction.amount);

    if (transaction.pixInformation) {
      console.log('Pix QR Code:', transaction.pixInformation.qrCode);
      console.log('End-to-End ID:', transaction.pixInformation.endToEndId);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validação do token
    if (payload.token !== AMPLPAY_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Processa o webhook
    await processWebhook(payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook AmploPay] Erro:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
