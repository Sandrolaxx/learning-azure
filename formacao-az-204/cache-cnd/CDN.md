# Azure Content Delivery Network (CDN)

É um componente essencial para escalabilidade global e performance de front-end. No exame AZ-204, a Microsoft foca em como você configura o comportamento de cache, como integra com outros serviços (Storage/Web Apps) e como gerencia a atualização de conteúdo.

## O que é e Arquitetura Básica

A Azure CDN é uma rede distribuída de servidores (chamados de **Edge Servers** ou Pontos de Presença - POPs) que entregam conteúdo da Web aos usuários com base em sua localização geográfica.

* **Objetivo:** Reduzir a latência física. Se seu servidor está nos EUA e o usuário no Brasil, a CDN entrega uma cópia salva num servidor em São Paulo.
* **O que ela armazena:** Conteúdo estático (imagens, CSS, JS, vídeos, fontes). Ela *não* processa lógica de backend (C#, Java), apenas repassa a resposta.

### O Fluxo de Requisição (Importante para entender Latência)

1. **Usuário** acessa `imagem.jpg`.
2. **DNS** roteia para o **Edge Server** mais próximo.
3. **Cache Hit:** Se a imagem já estiver lá e válida (TTL não expirou), o Edge entrega imediatamente. (Milisegundos).
4. **Cache Miss:** Se não estiver lá, o Edge vai até a **Origem** (seu Web App ou Blob Storage), baixa a imagem, entrega ao usuário e **salva uma cópia** para o próximo.

---

## Componentes Principais

Para configurar uma CDN, você precisa criar dois recursos hierárquicos:

1. **CDN Profile (Perfil):** É o contêiner de nível superior. Aqui você escolhe o nível de preço e o provedor (SKU).
* *Provedores:* Microsoft, Edgio (antiga Verizon), Akamai.

2. **CDN Endpoint (Ponto de Extremidade):** É o ponto de acesso específico.
* *Origem:* De onde vem o dado? (Storage Account, App Service, IP Público customizado).
* *Hostname:* `meusite.azureedge.net`.

---

## Controle de Cache (Caching Behavior) ⚠️ *Tópico Crítico*

O exame AZ-204 adora perguntar como a CDN trata URLs com parâmetros (`?param=1`). Isso é configurado nas **Query String Caching Rules**.

| Modo de Cache | Comportamento | Cenário Ideal |
| --- | --- | --- |
| **Ignore Query Strings** (Padrão) | A CDN ignora o que vem depois do `?`. `foto.jpg?v=1` e `foto.jpg?v=99` retornam o mesmo arquivo cacheado. | Melhor performance para sites onde parâmetros são irrelevantes para o conteúdo (ex: tracking de analytics). |
| **Bypass Caching** | A requisição **nunca** é cacheada se tiver query string. Vai sempre na origem. | Dados dinâmicos ou conteúdo que muda a cada request. |
| **Cache Every Unique URL** | `foto.jpg?v=1` é um arquivo, `foto.jpg?v=2` é outro. A CDN salva cópias separadas. | **Versionamento de Assets.** Ideal para garantir que o usuário veja a versão nova de um CSS/JS. |

### Time-to-Live (TTL)

Quanto tempo o arquivo fica no Edge?

1. **Cabeçalhos de Origem (Prioridade):** Se o seu servidor (Backend) enviar `Cache-Control: max-age=3600`, a CDN obedece (1 hora).
2. **Padrão da CDN:** Se a origem não mandar nada, o padrão é **7 dias**.

---

## Invalidação de Cache (Atualizando Conteúdo)

Você atualizou o `banner.jpg` no servidor, mas os usuários continuam vendo o banner antigo. Como resolver?

### A. Purge (Limpeza Forçada)

Apaga o arquivo do Edge Server imediatamente, forçando uma nova busca na origem na próxima requisição.

* **Single Path:** Purga um arquivo específico (`/images/logo.png`).
* **Wildcard:** Purga uma pasta inteira (`/images/*`).
* **Root:** Purga tudo (`/*`). **Cuidado:** Isso pode derrubar seu backend, pois todo o tráfego global baterá na origem ao mesmo tempo.
* **Desvantagem:** Demora alguns minutos para propagar e pode ter custo se feito excessivamente.

### B. Versionamento de Arquivos (Recomendado pela Microsoft) ✅

Em vez de fazer Purge, mude o nome do arquivo ou a query string.

* Antigo: `style.css` ou `style.css?v=1`
* Novo: `style-v2.css` ou `style.css?v=2` (com modo "Cache Every Unique URL").
* **Vantagem:** Atualização instantânea e zero custo de processamento de purge.

---

## Segurança e Acesso

### HTTPS e Domínios Customizados

* A URL padrão é `meusite.azureedge.net` (já tem HTTPS).
* Você pode mapear `cdn.minhaempresa.com`.
* **Certificado SSL:** O Azure pode gerenciar o certificado para você (gratuito e renovação automática) OU você pode trazer seu próprio certificado (via Key Vault).

### Geo-Filtering (Filtragem Geográfica)

Você pode permitir ou bloquear o acesso ao seu conteúdo baseado no país.

* *Exemplo:* Bloquear acesso a vídeos de direitos autorais fora do Brasil.
* Configurado no Endpoint.

### SAS Tokens com CDN (Blobs Privados)

Se o seu Blob Storage é **privado**, a CDN não consegue ler por padrão.

1. Crie uma **SAS Token** (assinatura de acesso compartilhado) para o Blob.
2. Acesse a CDN usando a SAS na URL: `meusite.azureedge.net/arquivo.jpg?<SAS-TOKEN>`.
3. *Configuração:* O modo de cache deve ser **Cache Every Unique URL** para respeitar as diferentes SAS tokens, ou você deve usar o recurso de **Token Auth** (apenas na tier Premium da Edgio) para cenários avançados.

---

## Otimização de Performance

A CDN pode comprimir arquivos "on the fly" (em tempo real) antes de entregar ao usuário.

* **Compression:** Habilite para arquivos de texto (HTML, CSS, JS, JSON).
* A CDN usa Gzip ou Brotli.
* **Resultado:** O arquivo viaja menor pela internet -> carrega mais rápido -> custa menos banda (Data Egress).

---

## Resumo para "Cheat Sheet" AZ-204

1. **Problema:** Atualizei a imagem, mas usuário vê a velha.
* **Solução Rápida (Emergência):** **Purge**.
* **Solução Arquitetural (Design):** **Versionamento** (`v=2`).

2. **Problema:** Site lento para usuários na Ásia.
* **Solução:** Criar CDN Profile + Endpoint apontando para o Web App.

3. **Configuração:** Quero cachear versões diferentes do meu `script.js?v=1`.
* **Solução:** Query String Caching Behavior = **Cache every unique URL**.

4. **Cenário:** Servir site estático (SPA - React/Angular/Vue) hospedado no Blob Storage.
* **Solução:** Habilitar "Static Website" no Storage -> Criar CDN apontando para a URL do Static Website.

5. **Segurança:** Blobs são privados.
* **Solução:** Usar **SAS Tokens** na requisição da CDN.

---

## Simulado Final

**Imagens Antigas** - Você usa Azure CDN para servir as imagens do seu e-commerce. Você acabou de subir uma promoção de Black Friday, sobrescrevendo o arquivo banner-home.jpg no Blob Storage de origem. Porém, a CDN ainda está mostrando o banner de Natal. Você precisa resolver isso imediatamente. O que você faz?

A) Esperar o TTL (Time-to-live) expirar (7 dias).

B) Executar uma operação de Purge no endpoint da CDN para o caminho /banner-home.jpg.

C) Reiniciar o App Service de origem.

D) Mudar o Tier da CDN de Standard para Premium.

(Resposta)

.

.

.

.

.

.

.

**B (Purge)**. É a única forma de forçar a atualização imediata mantendo o mesmo nome de arquivo.


---

## Lab utilizando CDN

Podemos encontrar mais informações sobre o lab mão na massa [aqui](./lab-cdn/readme.md).