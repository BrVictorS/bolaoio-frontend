# 📋 Especificações de API - Sistema de PIX para Palpites

## 🎯 Objetivo

O frontend agora suporta exibição de QR Code PIX para pagamento de palpites. Este documento define os endpoints e estrutura de dados necessários no backend.

---

## 🔌 Endpoints Necessários

### 1. **Gerar PIX para Palpite**

```http
POST /palpite/{palpiteId}/gerar-pix
Content-Type: application/json
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "palpiteId": 123,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",  // Aceitar ambos
  "pixCopy": "00020126580014BR.GOV.BCB.PIX0136aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa520400005303986540510.005802BR5913FULANO DE TAL6009SAO PAULO62410503***63041D3D",
  "pix_copy": "00020126580014BR.GOV.BCB.PIX0136aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa520400005303986540510.005802BR5913FULANO DE TAL6009SAO PAULO62410503***63041D3D",  // Aceitar ambos
  "valor": 50.00,
  "status": "pendente",
  "criadoEm": "2024-12-15T20:30:00Z",
  "expiraEm": "2024-12-16T20:00:00Z"
}

Response 400:
{
  "success": false,
  "message": "Palpite já foi pago"
}

Response 404:
{
  "success": false,
  "message": "Palpite não encontrado"
}
```

**Descrição:**
- Gera um QR Code PIX para um palpite específico
- O QR Code é uma imagem em base64
- O código PIX é a string em branco que pode ser copiada para um app de PIX
- Expiração: geralmente 24-30 minutos do horário de geração
- Não gerar novo PIX se já foi pago
- Não permitir gerar PIX se o palpite foi finalizado/jogo encerrou

---

### 2. **Verificar Status de Pagamento**

```http
GET /palpite/{palpiteId}/status-pagamento
Authorization: Bearer {token}

Response 200:
{
  "palpiteId": 123,
  "status": "pago|pendente|expirado",
  "statusPagamento": "pago|pendente|expirado",  // Aceitar ambos
  "pagamentoEm": "2024-12-15T20:45:00Z",  // null se não pago
  "valor": 50.00,
  "pixId": "abc123def456"  // ID externo da transação, se houver
}

Response 404:
{
  "success": false,
  "message": "Palpite não encontrado"
}
```

**Descrição:**
- Verifica se um palpite foi pago
- Status pode ser: pendente, pago, expirado
- Retorna quando o pagamento foi realizado
- Útil para verificar em tempo real se PIX foi processado

---

### 3. **Obter Informações de PIX**

```http
GET /palpite/{palpiteId}/pix-info
Authorization: Bearer {token}

Response 200:
{
  "palpiteId": 123,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "pixCopy": "00020126580014BR.GOV.BCB.PIX0136...",
  "pix_copy": "00020126580014BR.GOV.BCB.PIX0136...",
  "valor": 50.00,
  "criadoEm": "2024-12-15T20:30:00Z",
  "expiraEm": "2024-12-16T20:00:00Z",
  "status": "pendente",
  "statusPagamento": "pendente|pago|expirado"
}

Response 404:
{
  "success": false,
  "message": "Nenhum PIX gerado para este palpite"
}
```

**Descrição:**
- Recupera o QR Code e dados de um PIX já gerado
- Sem expiração de PIX não gera novo
- Se expirou, poderia gerar novo ou retornar erro pedindo nova geração
- Útil para exibir novamente o QR Code em "Meus Palpites"

---

### 4. **Confirmar Pagamento (Webhook/Manual)**

```http
POST /palpite/{palpiteId}/confirmar-pagamento
Content-Type: application/json
Authorization: Bearer {token}

Request:
{
  "pixId": "abc123def456",  // ID externo da transação
  "valor": 50.00,
  "processadoEm": "2024-12-15T20:45:00Z"
}

Response 200:
{
  "success": true,
  "message": "Pagamento confirmado com sucesso",
  "palpiteId": 123,
  "status": "pago"
}

Response 400:
{
  "success": false,
  "message": "Valores não correspondem"
}
```

**Descrição:**
- Confirmação manual ou via webhook de pagamento
- Webhook pode ser chamado pela instituição bancária
- Validar valor para evitar manipulações
- Marcar palpite como pago no banco de dados

---

## 📊 Estrutura de Dados no Banco

### Tabela: `Palpites`

Adicionar/Modificar campos:

```sql
ALTER TABLE Palpites ADD COLUMN (
  -- PIX
  pix_qr_code LONGTEXT,           -- Base64 da imagem
  pix_copy VARCHAR(500),          -- Código para copiar
  pix_valor DECIMAL(10,2),        -- Valor do PIX
  pix_criado_em DATETIME,         -- Quando foi gerado
  pix_expira_em DATETIME,         -- Quando expira
  pix_id VARCHAR(100),            -- ID externo da transação
  
  -- Status de Pagamento
  status_pagamento ENUM(
    'pendente',
    'pago',
    'expirado'
  ) DEFAULT 'pendente',
  
  pagamento_em DATETIME,          -- Quando foi pago
  pagamento_confirmado_por VARCHAR(50)  -- Via de confirmação (webhook, manual, etc)
);

-- Índices para performance
CREATE INDEX idx_status_pagamento ON Palpites(status_pagamento);
CREATE INDEX idx_pix_expira_em ON Palpites(pix_expira_em);
```

---

## 🔄 Fluxo de Pagamento

```
1. Usuário cria palpite
   ↓
2. Frontend chama POST /palpite/{id}/gerar-pix
   ↓
3. Backend:
   - Gera QR Code PIX (usando biblioteca)
   - Salva dados no banco
   - Retorna QR Code e pixCopy
   ↓
4. Frontend exibe Modal com QR Code
   ↓
5. Usuário escaneia com app de banco ou copia e cola
   ↓
6. Banco processa pagamento
   ↓
7. Banco chama webhook (ou backend verifica API)
   ↓
8. Backend marca como "pago"
   ↓
9. Frontend monitora status (polling ou WebSocket)
   ↓
10. Quando pago:
    - Desbloqueia funcionalidades do palpite
    - Remove botão de PIX em "Meus Palpites"
    - Atualiza visual (verde, "Pago")
```

---

## 🔧 Implementação

### Geradores de QR Code (Recomendações)

#### C# / .NET
```csharp
// NuGet: QRCoder
var qrGenerator = new QRCodeGenerator();
var qrCodeData = qrGenerator.CreateQrCode(pixCode, QRCodeGenerator.ECCLevel.Q);
var qrCode = new PngByteQRCode(qrCodeData);
var qrCodeImage = qrCode.GetGraphic(20);

// Converter para Base64
string base64 = "data:image/png;base64," + Convert.ToBase64String(qrCodeImage);
```

#### Python / FastAPI
```python
# pip install qrcode[pil]
import qrcode
import base64
from io import BytesIO

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(pix_code)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
buffer = BytesIO()
img.save(buffer, format='PNG')
buffer.seek(0)
base64_code = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()
```

### Gerador de PIX (Recomendações)

#### Usar API de Instituição Bancária
- **Banco24h**: API de PIX
- **Mercado Pago**: API de PIX
- **Efí**: API de PIX
- **Pagar.me**: API de PIX

Cada uma oferece:
- Geração de QR Code
- Monitoramento de pagamento
- Webhooks de confirmação

---

## 📱 Campos Flexíveis

Para melhor compatibilidade, aceitar múltiplas variações:

```javascript
// Frontend aceita:
qrCode: data.qrCode || data.qr_code || data.qrcodeData
pixCopy: data.pixCopy || data.pix_copy || data.pixCode
valor: data.valor || data.value
expiraEm: data.expiraEm || data.expira_em || data.expiresAt
status: data.status || data.statusPagamento || data.pagamentoStatus
```

Isso permite flexibilidade na nomeação do backend.

---

## ✅ Checklist de Implementação

### Backend
- [ ] Criar endpoints GET/POST para PIX
- [ ] Integrar com gerador de QR Code
- [ ] Integrar com API de instituição bancária
- [ ] Adicionar campos de PIX na tabela Palpites
- [ ] Implementar webhook de confirmação
- [ ] Adicionar validações:
  - [ ] Não permitir PIX para palpite já pago
  - [ ] Não permitir PIX para jogo finalizado
  - [ ] Verificar expiração de PIX
  - [ ] Validar valores

### Frontend (Já implementado ✅)
- [x] Criar pixService.js
- [x] Criar QRCodePixModal.jsx
- [x] Integrar em Palpite.jsx
- [x] Integrar em MeusPalpites.jsx
- [x] Adicionar botão de PIX em Meus Palpites
- [x] Adicionar Modal para exibição

---

## 🧪 Testes

### Teste Local
```bash
# Simular geração de PIX
POST http://localhost:3000/palpite/123/gerar-pix
Authorization: Bearer token_teste

# Resposta esperada:
# {
#   "success": true,
#   "qrCode": "data:image/png;base64,...",
#   "pixCopy": "0002012658...",
#   "valor": 50.00,
#   "expiraEm": "2024-12-16T20:00:00Z"
# }
```

### Teste de Integração
1. Criar palpite
2. Verificar se QR Code aparece
3. Verificar se código PIX aparece
4. Testar copiar código
5. Testar compartilhar no WhatsApp
6. Simular pagamento (marcar como pago no banco)
7. Verificar se botão desaparece

---

## 📞 FAQ do Backend

**P: Preciso usar uma instituição bancária específica?**
R: Recomenda-se usar uma das APIs mencionadas (Banco24h, Efí, etc) que facilitam integração PIX.

**P: Quanto tempo leva para confirmar o pagamento?**
R: Depende da instituição. Geralmente segundos a minutos via webhook.

**P: E se o PIX expirar?**
R: O frontend pode chamar `gerarPixParaPalpite()` novamente para gerar um novo QR code.

**P: Como funciona se o banco processar pagamento manual?**
R: Você chama POST `/palpite/{id}/confirmar-pagamento` manualmente ou via webhook.

**P: Há limite de PIX por usuário?**
R: Não há limite técnico, mas você pode adicionar lógica de limite se necessário.

---

## 🔐 Segurança

- ✅ Validar token JWT em todos os endpoints
- ✅ Validar que o usuário é o dono do palpite
- ✅ Validar valores antes de confirmar pagamento
- ✅ Não expor dados sensíveis nas respostas
- ✅ Implementar rate limiting em geração de PIX
- ✅ Logs de todas as transações PIX
- ✅ Usar HTTPS em produção

---

## 📈 Próximas Melhorias

1. **Monitoramento automático**: Fazer polling para verificar pagamento sem refresh
2. **WebSocket**: Notificação em tempo real quando pagamento é confirmado
3. **Histórico**: Guardar histórico de todas as tentativas de PIX
4. **Reembolso**: Endpoint para reembolsar PIX se necessário
5. **Múltiplas formas de pagamento**: Débito, crédito, etc
6. **Cupom de desconto**: Aplicar desconto no valor do PIX

---

## 📚 Referências

- [Documentação PIX BCB](https://www.bcb.gov.br/pix)
- [QRCoder (.NET)](https://github.com/codebude/QRCoder)
- [qrcode (Python)](https://github.com/lincolnloop/python-qrcode)
- [Banco24h API](https://banco24h.com.br/api)
- [Efí API](https://api.efipay.com.br/doc)

---

## ✨ Status

**Especificação**: ✅ Completa
**Frontend**: ✅ Implementado e pronto
**Backend**: 🔄 Aguardando implementação

Quando o backend estiver pronto, bastará seguir esta especificação para integração completa!
