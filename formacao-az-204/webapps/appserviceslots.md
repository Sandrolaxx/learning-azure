# Deployment Slots**

### A Arquitetura: O Que Realmente Acontece? (VIP Swap)

Muitos acham que o Azure move os arquivos de uma pasta para outra. **Não é isso.**

* **Infraestrutura:** Ambos os slots (ex: `Produção` e `Staging`) rodam no mesmo hardware (mesmo App Service Plan/VM).
* **Virtual IP Swap:** O Azure troca o **Roteamento Interno**.
    * Antes do Swap: O IP Público do seu site aponta para o Slot A (v1). O endereço `staging.azure...` aponta para o Slot B (v2).
    * Depois do Swap: O IP Público passa a apontar para o Slot B (v2). O endereço `staging` passa a apontar para o Slot A (v1).
* **Zero Downtime:** Como a troca é no balanceador de carga, nenhuma requisição é derrubada. As conexões ativas continuam no slot antigo até terminarem, e novas conexões vão para o novo slot.

---

### Configurações: O Que Viaja e O Que Fica? (Sticky Settings) ⚠️

Este é o ponto onde 80% dos candidatos erram. Você deve memorizar esta tabela.

O Azure chama isso de **"Slot Setting"** (Configuração de Slot). Se você marcar o checkbox "Deployment slot setting", a configuração **fica presa** ao slot e não viaja com o código.

| Categoria | Comportamento Padrão | Exemplo |
| :--- | :--- | :--- |
| **Configurações Gerais** | **Viajam (Swap)** | Versão do Framework, Web Sockets, 32/64-bit. |
| **Código e Conteúdo** | **Viajam (Swap)** | Seus arquivos `.dll`, `.js`, `.html`. |
| **App Settings / Env Vars** | **Viajam (Swap)** | Chaves de API genéricas, flags de feature. |
| **Connection Strings** | **Viajam (Swap)** | **PERIGO!** Se não marcar como "Slot Setting", a string de Dev vai para Prod. |
| **Endpoints de Publicação** | **Ficam (Sticky)** | As credenciais de deploy mudam de slot para slot. |
| **Certificados/Domínios** | **Viajam (Swap)** | Se o certificado for vinculado ao App Service geral. |
| **WebJobs** | **Viajam (Swap)** | WebJobs rodam onde o código estiver. |

> **Regra de Prova:** Connection Strings e configurações específicas de ambiente (ex: `Environment=Staging`) **DEVEM** ser marcadas como "Deployment slot setting".

---

### Fases do Swap (Warm-up)

O swap não é instantâneo, ele tem fases de segurança:

**Aplicação de Configurações:** O Azure aplica as configurações do slot de destino (Produção) na instância de origem (Staging) **antes** de virar a chave. Isso garante que o app vai rodar com as configurações reais.

**Warm-up (Aquecimento):** O Azure faz requisições HTTP para a raiz (`/`) do slot de origem. O app precisa retornar `200 OK`.
    * *Dica de Mestre:* Você pode configurar caminhos customizados de warm-up no `web.config` ou nas configurações para garantir que cache e banco de dados estejam prontos.
**Swap:** Se o warm-up passar, os VIPs são trocados.

---

### Tipos Avançados de Swap

#### Auto Swap (Swap Automático)

* **Cenário:** Integração Contínua (CI/CD) onde você confia 100% nos seus testes automatizados.
* **Funcionamento:** Assim que você faz o deploy no slot de Staging, o Azure inicia o aquecimento e faz o swap sozinho.
* **Restrição:** Não pode ser usado se você precisa de validação humana.

#### Swap with Preview (Troca com Visualização) 🔍

* **Cenário:** Aplicações críticas onde você quer validar se o app funciona com as **configurações de produção** antes de virar a chave.
* **Fase 1 (Apply):** O Azure aplica as configurações da Produção no slot de Staging, mas **NÃO** troca os IPs. O site de Produção continua intocado.
* **Fase 2 (Validation):** Você acessa a URL de Staging (que agora está rodando como se fosse produção) e testa.
* **Fase 3 (Complete/Cancel):** Se estiver bom, você clica em "Complete Swap". Se der erro, "Cancel Swap" (reverte as configs).

---

### Roteamento de Tráfego (Testing in Production)

Você pode usar slots para **Canary Deployment** (Teste Canário).
* Em vez de virar 100% de uma vez, você configura: "Mande 10% do tráfego de produção para o slot de Staging (nova versão)".
* **Cookie `x-ms-routing-name`:** Quando um usuário cai no slot de teste (os 10%), o Azure fixa um cookie no navegador dele. Isso garante que ele continue navegando na versão de teste durante toda a sessão (não fica pulando entre versões).
* Você pode forçar o acesso a um slot específico via URL usando o parâmetro `?x-ms-routing-name=staging`.

---

### Como desfazer um erro? (Undo Swap)

Fez o swap e a produção quebrou?

**Não entre em pânico.** Não tente fazer deploy da versão antiga.
Basta fazer o **Swap novamente**.
Como o slot de Staging agora contém a "versão antiga que funcionava" (pois eles trocaram de lugar), ao fazer o swap de novo, você coloca a versão estável de volta em produção imediatamente.

---

### Limitações Críticas (Tiers)

Isso cai como pergunta de "Requisitos Técnicos":

* **Free / Shared / Basic:** ❌ Sem Slots.
* **Standard:** ✅ Até 5 Slots.
* **Premium / Isolated:** ✅ Até 20 Slots.

---

### Resumo Visual para Prova

Imagine um **"X"**.

* **Swap Normal:** O tráfego cruza o X. O código cruza o X. As configurações "Sticky" ficam nas pontas do X e não cruzam.
* **Swap with Preview:** O código fica parado, as configurações da produção descem para o staging, você testa, e depois o X acontece.

---

**Desafio Rápido de Consolidação:**
Você tem um WebJob agendado para rodar a cada hora que processa pagamentos. Ele está no seu código. Você faz o deploy no slot de **Staging** para testar.
Se você não tomar cuidado, o que pode acontecer antes mesmo de você fazer o Swap para produção?

**Resposta:** O WebJob vai começar a rodar no slot de Staging assim que o deploy terminar. Se ele apontar para o banco de produção (erro de config), você pode processar pagamentos duplicados (um job rodando na Prod e outro na Staging ao mesmo tempo).
**Solução:** Marque a configuração do WebJob como "Sticky" ou configure o WebJob para ficar "Parado" no slot de Staging (`WEBJOBS_STOPPED = 1` nas App Settings do slot).