# APIM - API Management

É um serviço de nuvem híbrida e multinuvem para gerenciar APIs em todos os ambientes. Ele permite que as organizações publiquem APIs para desenvolvedores externos, parceiros e internos de forma segura e escalável. Esta documentação aborda componentes chave do APIM: Gateways de API, Policies, e mecanismos de segurança como Assinaturas e Certificados Digitais.

---

### Gateways de API

O **Gateway de API** é o ponto de entrada para todas as requisições às suas APIs gerenciadas pelo APIM. Ele atua como um proxy reverso, recebendo chamadas de API do cliente e encaminhando-as para os serviços de backend apropriados.

**Principais Funções:**

* **Roteamento de Requisições:** Direciona as chamadas para os backends corretos com base na configuração da API.
* **Verificação de Segurança:** Autentica e autoriza chamadas de API, aplicando políticas de segurança.
* **Transformação de Requisições e Respostas:** Pode modificar cabeçalhos, corpos de mensagem e formatos de dados entre o cliente e o backend.
* **Cache de Respostas:** Armazena respostas de API para reduzir a latência e a carga nos serviços de backend.
* **Coleta de Telemetria:** Registra dados de chamadas para monitoramento, análise e faturamento.
* **Limitação de Taxa e Cotas:** Impõe limites no número de chamadas que um cliente pode fazer em um determinado período.

O Azure API Management oferece gateways auto-hospedados (self-hosted gateways) que permitem implantar o componente de gateway em ambientes locais, outras nuvens ou em clusters Kubernetes, estendendo o gerenciamento de API para ambientes híbridos e multinuvem, enquanto o plano de gerenciamento permanece no Azure.

---

### Policies (Políticas)

As **Policies** no Azure API Management são uma coleção de declarações que são executadas sequencialmente no request ou response de uma API. Elas permitem modificar o comportamento da API sem a necessidade de alterar o código do backend. As políticas são configuradas em XML e podem ser aplicadas em diferentes escopos: global (todas as APIs), produto, API específica ou operação de API.

**Tipos Comuns de Policies:**

* **Autenticação e Autorização:** Validar tokens JWT, verificar chaves de assinatura, autenticação básica, impor autorização baseada em declarações.
* **Transformação:** Converter formatos de dados (XML para JSON, JSON para XML), reescrever URLs, definir ou remover cabeçalhos HTTP, modificar o corpo da requisição/resposta.
* **Limitação de Taxa e Cota:** Controlar o tráfego de API para proteger os serviços de backend contra picos de uso.
* **Cache:** Configurar o cache de respostas para melhorar o desempenho.
* **Controle de Fluxo:** Executar políticas condicionalmente, tentar novamente chamadas falhas, encaminhar requisições.
* **Validação:** Validar conteúdo de cabeçalhos, parâmetros e corpo da requisição/resposta contra esquemas.

As políticas são divididas em seções que são processadas em estágios específicos do ciclo de vida da requisição: `inbound` (processamento da requisição chegando ao gateway), `backend` (antes da requisição ser enviada ao backend), `outbound` (processamento da resposta vinda do backend) e `on-error` (tratamento de exceções).

---

### Protegendo APIs com Assinaturas

As **Assinaturas (Subscriptions)** são uma forma comum de controlar o acesso às APIs. Quando um desenvolvedor deseja consumir uma API, ele se inscreve em um **Produto** que contém essa API. Uma vez aprovada a inscrição, uma chave de assinatura (subscription key) primária e secundária é gerada.

**Funcionamento:**

1.  **Criação de Produtos:** As APIs são agrupadas em Produtos. Um produto define o escopo de acesso e pode ter políticas específicas associadas a ele (como cotas de uso).
2.  **Inscrição:** Desenvolvedores se inscrevem nos produtos para obter acesso às APIs contidas neles.
3.  **Chaves de Assinatura:** Após a inscrição, chaves de assinatura são fornecidas. O cliente deve incluir uma dessas chaves em cada requisição à API, geralmente no cabeçalho HTTP (por exemplo, `Ocp-Apim-Subscription-Key`).
4.  **Validação pelo Gateway:** O Gateway de API intercepta a requisição, verifica a validade da chave de assinatura e se ela está associada a um produto que concede acesso à API solicitada. Se a chave for inválida ou não autorizada, a requisição é rejeitada.

As chaves de assinatura fornecem um nível básico de segurança e permitem o rastreamento do uso da API por consumidor.

---

### Protegendo APIs com Certificados Digitais

O Azure API Management suporta a autenticação mútua usando **Certificados Digitais** (também conhecida como mTLS - Mutual TLS) para proteger o acesso às APIs. Nesse cenário, tanto o cliente quanto o servidor (Gateway de API) se autenticam utilizando certificados X.509.

**Funcionamento para Autenticação de Cliente:**

1.  **Emissão de Certificados:** O cliente obtém um certificado digital de uma Autoridade Certificadora (CA) confiável ou um certificado autoassinado (para cenários de teste ou internos).
2.  **Upload do Certificado da CA (ou do próprio certificado) no APIM:** Para que o Gateway de API confie nos certificados de cliente, o certificado da CA que emitiu os certificados de cliente (ou os próprios certificados de cliente, se forem autoassinados ou emitidos por CAs diferentes) deve ser carregado no serviço API Management.
3.  **Configuração da API/Gateway:** A API ou o Gateway é configurado para exigir um certificado de cliente.
4.  **Requisição do Cliente:** O cliente envia sua requisição para a API, apresentando seu certificado digital durante o handshake TLS.
5.  **Validação pelo Gateway:**
    * O Gateway de API verifica se o certificado do cliente foi emitido por uma CA confiável (configurada no APIM).
    * Pode validar outros atributos do certificado, como o emissor, a impressão digital (thumbprint) ou o nome do assunto (subject name), através de políticas.
    * Se a validação for bem-sucedida, a requisição é processada; caso contrário, é rejeitada.

A autenticação com certificados digitais oferece um nível de segurança mais robusto em comparação com chaves de assinatura, pois envolve criptografia de chave pública e a necessidade do cliente possuir a chave privada correspondente ao certificado público apresentado. Isso é particularmente útil para cenários B2B (business-to-business) ou para APIs que exigem um alto grau de segurança.