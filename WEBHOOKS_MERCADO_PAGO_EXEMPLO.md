# 🔔 Exemplos de Webhooks - Mercado Pago PIX

## Como Testar no Postman

### 1. Configurar Requisição

```
Método: POST
URL: http://localhost:5000/webhook/mercado-pago
Headers:
  Content-Type: application/json
  User-Agent: Mercado Pago Webhook
```

---

## Exemplo 1: Webhook Básico (Conforme spec do código)

Use este quando quer testar a estrutura mínima esperada:

```json
{
  "action": "payment.created",
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

**Quando usar**: Testes iniciais, validar estrutura básica

---

## Exemplo 2: Webhook Realista - Pagamento Confirmado

Este é mais próximo do que Mercado Pago realmente envia:

```json
{
  "id": 9999999999,
  "live_mode": false,
  "type": "payment",
  "date_created": "2024-12-15T20:45:00.000Z",
  "user_id": 123456,
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "abc123def456"
  },
  "resource": "/v1/payments/123456789"
}
```

**Quando usar**: Teste mais realista, com campos adicionais do Mercado Pago

---

## Exemplo 3: Webhook Completo com Dados de Pagamento

Para teste completo com mais informações:

```json
{
  "id": 9999999999,
  "live_mode": false,
  "type": "payment",
  "date_created": "2024-12-15T20:45:00.000Z",
  "user_id": 123456,
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "abc123def456"
  },
  "resource": "/v1/payments/123456789",
  "payment": {
    "id": 123456789,
    "date_created": "2024-12-15T20:30:00.000Z",
    "date_approved": "2024-12-15T20:45:00.000Z",
    "date_last_updated": "2024-12-15T20:45:00.000Z",
    "money_release_date": "2024-12-15T20:45:00.000Z",
    "currency_id": "BRL",
    "settlement_amount": 50.00,
    "total_paid_amount": 50.00,
    "transaction_amount": 50.00,
    "net_received_amount": 50.00,
    "status": "approved",
    "status_detail": "accredited",
    "payer": {
      "id": 987654,
      "email": "usuario@example.com",
      "first_name": "João",
      "last_name": "Silva",
      "type": "customer"
    },
    "external_reference": "palpite-uuid-aqui",
    "description": "Palpite Bolão - PIX",
    "payment_method_id": "pix"
  }
}
```

**Quando usar**: Validação completa, incluindo dados de pagamento

---

## Exemplo 4: Webhook - Pagamento Recusado

Para testar cenário de falha:

```json
{
  "id": 9999999999,
  "live_mode": false,
  "type": "payment",
  "date_created": "2024-12-15T20:45:00.000Z",
  "user_id": 123456,
  "api_version": "v1",
  "action": "payment.updated",
  "data": {
    "id": "abc123def456"
  },
  "resource": "/v1/payments/123456789",
  "payment": {
    "id": 123456789,
    "status": "rejected",
    "status_detail": "payment_request_declined",
    "transaction_amount": 50.00,
    "external_reference": "palpite-uuid-aqui",
    "payment_method_id": "pix"
  }
}
```

**Quando usar**: Testar tratamento de pagamentos rejeitados

---

## Exemplo 5: Webhook - Teste Simples com IDs Reais

Use com seus próprios IDs para teste prático:

```json
{
  "action": "payment.updated",
  "type": "payment",
  "data": {
    "id": "sua-transacao-id-aqui"
  }
}
```

Substitua:
- `sua-transacao-id-aqui` → ID da transação (vem do `pix.Id` do Mercado Pago)

---

## 📋 Passo-a-Passo no Postman

### Criar Collection de Testes

1. **Abra Postman**
2. **Click em "+" → New Request**
3. **Configure:**
   - Método: `POST`
   - URL: `http://localhost:5000/webhook/mercado-pago`
   - Tab "Headers" → Adicione:
     ```
     Key: Content-Type
     Value: application/json
     ```

4. **Tab "Body" → Raw → JSON**
   - Cole um dos JSONs acima

5. **Click "Send"**

---

## 🔄 Fluxo de Teste Completo

### Teste 1: Simular Pagamento Bem-sucedido

```
1. Crie palpite no frontend (POST /bolao/registrar_palpite)
   → Obtém transactionId (external_reference)

2. No Postman, use Exemplo 2 ou 3 com:
   "data": {
     "id": "<transactionId que recebeu acima>"
   }

3. Envie webhook (POST /webhook/mercado-pago)

4. No frontend, verifique:
   - GET /bolao/palpite/{palpiteId}/status-pagamento
   - Status deve ser "pago"
   - Botão PIX desaparece
```

### Teste 2: Testar Valor Errado

```json
{
  "action": "payment.updated",
  "type": "payment",
  "data": {
    "id": "abc123def456"
  },
  "payment": {
    "external_reference": "palpite-uuid",
    "transaction_amount": 999.99,
    "status": "approved"
  }
}
```

O backend deve rejeitar porque valor não corresponde.

---

## ⚙️ Configurar Backend para Receber Webhooks

Se ainda não tiver o endpoint de webhook, você precisa criar:

```csharp
[HttpPost("/webhook/mercado-pago")]
[AllowAnonymous]  // Ou validar assinatura do Mercado Pago
public async Task<IResult> MercadoPagoWebhook([FromBody] MercadoPagoWebhookPayload payload)
{
    if (payload?.Type == "payment" && payload.Action == "payment.updated")
    {
        var pixId = payload.Data.Id;
        
        // Buscar palpite pela external_reference
        // Chamar POST /palpite/{id}/confirmar-pagamento
        
        return Results.Ok(new { success = true });
    }
    
    return Results.Ok(new { success = false });
}
```

---

## 🧪 Cenários de Teste

### Cenário 1: Happy Path
```
1. Crie palpite
2. Envie Exemplo 2 (sucesso)
3. Verifique status = "pago"
```

### Cenário 2: Valor Não Corresponde
```
1. Crie palpite com valor 50
2. Envie webhook com valor 30
3. Deve retornar erro "Valores não correspondem"
```

### Cenário 3: Palpite Não Existe
```
1. Envie webhook com palpiteId inválido
2. Deve retornar erro "Palpite não encontrado"
```

### Cenário 4: Pagamento Rejeitado
```
1. Crie palpite
2. Envie Exemplo 4 (rejected)
3. Status deve permanecer "pendente"
```

---

## 🔐 Validação de Webhook (Futuro)

Mercado Pago envia assinatura para validar:

```
Headers da requisição real:
X-Signature: abc123...
X-Request-Id: 123e4567-e89b-12d3-a456-426614174000
```

**Para validar** (implementar depois):
```csharp
public bool ValidarAssinaturaWebhook(HttpRequest request)
{
    var signature = request.Headers["X-Signature"].ToString();
    var requestId = request.Headers["X-Request-Id"].ToString();
    
    // Validar com chaves públicas do Mercado Pago
    // Documentação: https://www.mercadopago.com.br/developers
}
```

---

## 📚 Links Úteis

- [Documentação Webhooks Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/how-it-works/webhooks)
- [Tipos de Notificação](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/how-it-works/payment-status)
- [Validação de Assinatura](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/how-it-works/webhook-validation)

---

## ✅ Checklist de Testes

- [ ] Webhook básico é aceito
- [ ] Webhook realista é aceito
- [ ] Webhook com status "approved" marca como pago
- [ ] Webhook com valor errado é rejeitado
- [ ] Webhook com palpiteId inválido é rejeitado
- [ ] Webhook com status "rejected" não marca como pago
- [ ] Frontend detecta mudança de status via polling
- [ ] Botão PIX desaparece após pagamento
- [ ] Toast notificação aparece (se implementada)

---

**Pronto para testar! 🚀**
