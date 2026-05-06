# Módulo de Palpites - Guia de Implementação

## 📋 Resumo das Mudanças

Este documento descreve as melhorias implementadas no fluxo de criação e gerenciamento de palpites do Bolão.io.

### Arquivos Modificados

#### 1. **Palpite.jsx** ✅ Refatorado Completamente
**Mudanças principais:**
- ✅ Suporte a 2 tipos de bolão:
  - **Placar Exato (tipoBolao: 1)** - Inputs de números para gols
  - **Vencedor 1x2 (tipoBolao: 2)** - Botões para selecionar vencedor (A/E/B)
  
- ✅ Informações contextuais enriquecidas:
  - Exibição de bandeiras dos times
  - Data e hora da partida
  - Tipo de bolão em badge
  - Deadline de fechamento com contador
  - Status visual (prazo aberto/fechando/encerrado)

- ✅ Validações melhoradas:
  - Validação em tempo real
  - Erros destacados em vermelho
  - Desabilitamento automático se prazo passou
  - Limite máximo de 99 gols

- ✅ Modal de confirmação:
  - Resumo visual do palpite antes de enviar
  - Revisão fácil dos dados
  - Confirmação explícita

- ✅ Feedback visual aprimorado:
  - Toast de sucesso/erro
  - Loading state durante envio
  - Redirecionamento automático após sucesso
  - Mensagens de erro detalhadas

**Antes:**
```jsx
// Simples, sem validações
const [golsA, setGolsA] = useState(0);
const [golsB, setGolsB] = useState(0);
// Sem considerar tipo de bolão
```

**Depois:**
```jsx
// Estruturado com estado unificado
const [palpiteData, setPalpiteData] = useState({
    golsTimeA: 0,
    golsTimeB: 0,
    vencedor: null
});
// Renderiza componente diferente baseado em tipoBolao
{isTipoPlacarExato && <inputs de números />}
{isTipoVencedor && <botões de seleção />}
```

---

#### 2. **MeusPalpites.jsx** ✅ Completamente Refatorado
**Mudanças principais:**
- ✅ Estrutura de dados real (não mais mockada)
  - Integração com backend via palpiteService
  - Suporte a tipos diferentes de bolão
  
- ✅ Filtros funcionais:
  - "Todos" - mostra todos os palpites
  - "Pendentes" - apenas em andamento
  - "Finalizados" - apenas terminados

- ✅ Cartões informativos:
  - Status visual com badges coloridas e ícones
  - Comparação palpite vs placar real
  - Indicação de acerto/erro automática
  - Data e hora do palpite

- ✅ Ações funcionais:
  - Botão "Editar" para palpites pendentes
  - Botão "ZAP" para compartilhar no WhatsApp (funcional)
  - Botão "Detalhes" para ver mais informações
  
- ✅ Estatísticas rápidas:
  - Total de palpites
  - Quantidade pendente
  - Quantidade finalizada

**Antes:**
```jsx
// Dados mockados, não funcional
{item.timeVencedor}
{item.placarPalpite}
// Botões ZAP/PIX não faziam nada
```

**Depois:**
```jsx
// Dados dinâmicos do backend
{getPalpiteResume(palpite)}
{formatarValor(palpite.valorApostado)}
// Botões com funcionalidade real
<button onClick={() => window.open(`https://wa.me/?text=${encoded}`)} />
```

---

#### 3. **Novos Componentes Criados**

##### **ConfirmacaoPalpiteModal.jsx** ✨ Novo
Modal de confirmação com:
- Resumo visual do palpite
- Dados do bolão
- Diferença clara entre tipos (placar vs vencedor)
- Aviso sobre permanência da aposta
- Botões Revisar / Confirmar

```jsx
// Exibição adaptada ao tipo
{isTipoPlacarExato && <placar visual />}
{isTipoVencedor && <seleção visual />}
```

##### **ToastNotification.jsx** ✨ Novo
Sistema de notificações com:
- 4 tipos: success (verde), error (vermelho), warning (amarelo), info (azul)
- Auto-dismiss em 4 segundos
- Barra de progresso animada
- Ícones apropriados

---

#### 4. **palpiteService.js** ✅ Expandido
**Novas funcionalidades:**
- ✅ Melhor tratamento de erros
- ✅ Validação de dados antes de envio
- ✅ Mensagens de erro amigáveis
- ✅ Novos métodos:
  - `getPalpiteById(palpiteId)` - obter palpite específico
  - `updatePalpite(palpiteId, data)` - atualizar palpite
  - `deletePalpite(palpiteId)` - remover palpite
  - `validarPalpite(bolaoId)` - validar antes de criar

```javascript
// Agora retorna objeto estruturado
{
  success: true/false,
  message: 'descrição clara do que aconteceu',
  data: { ...resposta do backend }
}
```

---

## 🎨 Melhorias de UX/Design

### Cores e Badges
```tailwind
// Tipo de bolão
bg-green-500/10 - Placar Exato
bg-blue-500/10  - Vencedor 1x2

// Status de jogo
bg-blue-500/10  - Agendada (📅)
bg-yellow-500/10 - Em Jogo (🔴 com pulse)
bg-green-500/10  - Finalizada (✓)

// Deadline
bg-green-500/10  - Prazo aberto
bg-yellow-500/10 - Fechando em breve
bg-red-500/10    - Prazo encerrado
```

### Transições e Animações
- Fade-in ao carregar
- Slide-in para toast
- Pulse para "Em Jogo"
- Scale para modal
- Hover effects nos cards

---

## 🔌 Integração Backend

### Endpoints Esperados

#### Criar Palpite
```
POST /bolao/registrar_palpite
Body:
{
  "BolaoId": number,
  "golsTimeA": number,      // se placar exato
  "golsTimeB": number,      // se placar exato
  "vencedor": "A"|"E"|"B"   // se vencedor 1x2
}

Response:
{
  "success": true,
  "message": "Palpite registrado com sucesso!",
  "data": { ... }
}
```

#### Listar Palpites
```
GET /bolao/listar_palpites_por_usuario

Response: Array<Palpite>
{
  "id": number,
  "bolaoId": number,
  "nomeBolao": string,
  "descricaoJogo": string,        // "Time A × Time B"
  "timeA": string,
  "timeB": string,
  "tipoBolao": 1|2,
  "statusJogo": "Agendada"|"Em Jogo"|"Finalizada",
  "golsTimeA": number,             // se tipo 1
  "golsTimeB": number,             // se tipo 1
  "vencedor": "A"|"E"|"B",         // se tipo 2
  "placarAtual": string,           // "2 × 1" se finalizado
  "valorApostado": number,
  "dataPalpite": ISO8601,
  "dtFechamento": ISO8601
}
```

#### Endpoints Adicionais (Recomendados)
```
GET /bolao/:bolaoId/palpite/:palpiteId
PUT /bolao/palpite/:palpiteId
DELETE /bolao/palpite/:palpiteId
GET /bolao/:bolaoId/validar-palpite
```

---

## 📱 Responsividade

Todos os componentes são responsive:
- **Mobile**: Stack vertical, full-width
- **Tablet**: 2 colunas onde apropriado
- **Desktop**: Layout completo com múltiplas colunas

---

## ✨ Features Implementadas

### Fase 1 - Crítica ✅
- [x] Suporte a tipos de bolão (Placar Exato vs Vencedor)
- [x] Exibição de deadline e status
- [x] Validações em tempo real
- [x] Modal de confirmação
- [x] Toast de feedback
- [x] Bandeiras dos times

### Fase 2 - Importante ✅
- [x] Listagem estruturada de palpites
- [x] Filtros funcionais
- [x] Comparação resultado vs palpite
- [x] Compartilhamento WhatsApp
- [x] Botão de edição

### Fase 3 - Nice-to-have 🔄
- [ ] PIX funcional (requer integração)
- [ ] Análise de histórico
- [ ] Previsões por IA
- [ ] Ranking de acertos

---

## 🧪 Testes Recomendados

### Testes Manuais
1. Criar palpite com placar exato
2. Criar palpite com vencedor 1x2
3. Tentar criar com prazo encerrado
4. Compartilhar no WhatsApp
5. Filtrar palpites
6. Visualizar resultado em palpite finalizado

### Testes de Integração
1. Validar estrutura de resposta do backend
2. Testar tratamento de erros (500, 400, etc)
3. Validar campos obrigatórios
4. Testar timeout de requisição

---

## 🐛 Troubleshooting

### Problema: "Palpite não aparece em Meus Palpites"
**Solução**: Verificar se endpoint GET `/bolao/listar_palpites_por_usuario` está retornando dados corretos

### Problema: "Modal não fecha após confirmar"
**Solução**: Validar se `handleSalvarPalpite` é chamado corretamente e se resposta tem `success: true`

### Problema: "Bandeiras não aparecem"
**Solução**: Validar se `flagA` e `flagB` vêm preenchidos do backend

### Problema: "Toast não aparece"
**Solução**: Verificar se `ToastNotification` está importado no componente

---

## 📚 Exemplo de Uso

### Criar novo palpite
```javascript
// Usuário navega para /bolao/:idBolao/palpite
// Palpite.jsx carrega dados do bolão
// Usuário seleciona números ou vencedor
// Clica "Confirmar Palpite"
// Modal aparece para revisão
// Clica "Confirmar" no modal
// Palpite é enviado via palpiteService.postPalpite()
// Toast de sucesso aparece
// Redireciona para /meus-palpites
```

### Visualizar palpites
```javascript
// Usuário acessa /meus-palpites
// MeusPalpites.jsx carrega via palpiteService.getPalpiteByUser()
// Lista é filtrada e exibida com status visual
// Usuário pode editar (se pendente) ou compartilhar (WhatsApp)
```

---

## 🚀 Próximos Passos

1. **Backend**: Validar/ajustar endpoints conforme documentado
2. **Testes**: Executar testes manuais em todos os cenários
3. **Deploy**: Testar em staging antes de produção
4. **Monitoramento**: Acompanhar erros via console do backend
5. **Feedback**: Recolher feedback de usuários para v2

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador (F12)
2. Verificar logs do backend
3. Revisar documentação acima
4. Consultar arquivo de análise (ANALISE_MELHORIAS_PALPITES.md)
