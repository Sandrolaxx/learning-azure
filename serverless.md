## Azure Functions

É um serviço de computação sem servidor (*serverless*) e orientado a eventos que permite a execução de pequenos trechos de código, conhecidos como "funções", sem a necessidade de gerenciar explicitamente a infraestrutura subjacente. Com o Functions, você se concentra no código que importa, enquanto o Azure cuida do provisionamento e da escalabilidade dos recursos necessários para executá-lo.

-----

### Principais conceitos

  - **Computação sem servidor (Serverless):** O Azure gerencia a alocação e o provisionamento de servidores. O serviço é escalado automaticamente para atender à demanda, e você paga apenas pelo tempo em que seu código está em execução.
  - **Orientado a eventos:** As funções são executadas em resposta a gatilhos (*triggers*), que podem ser eventos de diversos serviços do Azure ou de terceiros.
  - **Conectores (Bindings):** Simplificam a integração com outros serviços. As vinculações de entrada (*input bindings*) fornecem dados para sua função, enquanto as de saída (*output bindings*) enviam dados da sua função para outros serviços, sem a necessidade de escrever código de integração complexo.

-----

### Gatilhos e conectores (Triggers e Bindings)

Os gatilhos definem como uma função é iniciada, e cada função deve ter exatamente um gatilho. Os conectores, por sua vez, são uma forma declarativa de conectar dados à sua função.

#### Gatilhos comuns:

| Gatilho | Descrição |
| --- | --- |
| **HTTP** | Executa a função em resposta a uma requisição HTTP. Ideal para criar APIs web. |
| **Timer** | Executa a função em um agendamento predefinido (ex: a cada 5 minutos). |
| **Fila (Queue Storage)** | Dispara a função quando uma nova mensagem é adicionada a uma fila do Azure Storage. |
| **Blob Storage** | Inicia a função quando um novo blob (arquivo) é criado ou atualizado em um contêiner. |
| **Azure Cosmos DB** | Executa a função em resposta a inserções ou atualizações em uma coleção do Cosmos DB. |
| **Barramento de Serviço (Service Bus)** | Dispara a função em resposta a novas mensagens em um tópico ou fila do Service Bus. |

#### Exemplo de conectores:

Uma função com um **gatilho HTTP** pode ter um **conector de saída para o Blob Storage**. Ao receber uma requisição HTTP, a função pode processar os dados e salvar o resultado como um arquivo de texto em um contêiner de armazenamento, tudo com uma configuração mínima.

-----

### Como criar uma Azure Function (Portal do Azure)

1.  **Acesse o portal do Azure:** Faça login em [portal.azure.com](https://www.google.com/search?q=https://portal.azure.com).
2.  **Crie um aplicativo de funções:**
      * Clique em "Criar um recurso".
      * Procure por "Aplicativo de Funções" e selecione-o.
      * Clique em "Criar".
      * Preencha os detalhes necessários, como assinatura, grupo de recursos, nome do aplicativo de funções, runtime (linguagem de programação como .NET, Node.js, Python, etc.), região e plano de hospedagem.
3.  **Crie uma função:**
      * Dentro do seu Aplicativo de Funções, vá para a guia "Funções" e clique em "Criar".
      * Escolha um modelo de desenvolvimento (por exemplo, "Desenvolver no portal").
      * Selecione um modelo de gatilho, como "Gatilho HTTP".
      * Dê um nome para sua função e defina o nível de autorização.
4.  **Codifique e teste:**
      * Após a criação, você será levado ao editor de código, onde poderá escrever ou modificar a lógica da sua função.
      * Para testar, clique em "Obter URL da função", copie o link e acesse-o em um navegador ou use uma ferramenta como o Postman para enviar requisições.

-----

### Modelos de Preços

O Azure Functions oferece diferentes planos de preços para atender a diversas necessidades:

  - **Plano de Consumo:** O plano sem servidor clássico. Você paga apenas pelo tempo de execução da sua função e pelo número total de execuções. Há um nível gratuito generoso por mês. É ideal para cargas de trabalho com tráfego variável ou esporádico.
  - **Plano Premium:** Oferece instâncias "quentes" para evitar partidas a frio (cold starts), garantindo um desempenho mais rápido. Este plano é faturado com base nos recursos de vCPU e memória alocados por segundo.
  - **Plano do Serviço de Aplicativo (App Service Plan):** Permite que suas funções sejam executadas em um plano do Serviço de Aplicativo existente, juntamente com suas outras aplicações web, APIs e aplicativos móveis, com um custo previsível.

-----

### Casos de uso comuns

O Azure Functions é uma ferramenta versátil que pode ser utilizada em uma ampla gama de cenários:

  - **APIs e microsserviços sem servidor:** Crie rapidamente APIs RESTful escaláveis.
  - **Processamento de arquivos em tempo real:** Redimensione imagens ou processe dados de arquivos assim que são carregados no Blob Storage.
  - **Tarefas agendadas:** Execute trabalhos de limpeza de banco de dados, geração de relatórios ou envio de notificações em horários específicos.
  - **Processamento de dados de IoT:** Processe e analise fluxos de dados de dispositivos de Internet das Coisas em tempo real.
  - **Automação de fluxos de trabalho:** Integre-se com o Azure Logic Apps para criar fluxos de trabalho complexos e orquestrar diferentes serviços.
  - **Back-ends para aplicativos móveis e web:** Forneça lógica de negócios para suas aplicações de front-end de forma escalável e econômica.

---

## Azure Logic Apps

É um serviço de integração baseado em nuvem que permite automatizar fluxos de trabalho e processos de negócios sem a necessidade de escrever código complexo. Ele funciona como uma plataforma de orquestração que conecta centenas de serviços, desde aplicações da Microsoft até soluções de terceiros, tanto na nuvem quanto em ambientes locais (*on-premises*).

Com uma abordagem visual e de baixo código (*low-code*), o Logic Apps permite que desenvolvedores e até mesmo usuários de negócios criem, gerenciem e implantem fluxos de trabalho escaláveis para integrar aplicativos, dados, sistemas e serviços.

-----

### Principais conceitos

  - **Fluxo de trabalho (Workflow):** A sequência de etapas que define um processo de negócio. Em um Aplicativo Lógico, cada fluxo de trabalho começa com um único gatilho e executa uma série de ações.
  - **Gatilho (Trigger):** O ponto de partida de um fluxo de trabalho. Um gatilho é um evento que inicia o Aplicativo Lógico. Pode ser algo como o recebimento de um e-mail, a criação de um arquivo no OneDrive ou uma requisição HTTP.
  - **Ação (Action):** Cada etapa que ocorre após o gatilho. As ações são as operações que o fluxo de trabalho executa, como enviar uma notificação, transformar dados, inserir uma linha em um banco de dados ou chamar outra API.
  - **Conectores (Connectors):** São componentes pré-construídos que atuam como invólucros para APIs, permitindo que o Logic Apps se comunique com um serviço específico. Existem centenas de conectores disponíveis, como Office 365, Salesforce, SQL Server, Twitter, Dropbox, e muitos outros.

-----

### Gatilhos e ações

Todo fluxo de trabalho no Logic Apps é definido por um gatilho e uma ou mais ações.

#### Tipos comuns de gatilhos:

| Gatilho | Descrição |
| :--- | :--- |
| **Recorrência** | Inicia o fluxo de trabalho em um agendamento fixo (ex: a cada hora, diariamente às 17h). |
| **Quando uma solicitação HTTP é recebida**| Dispara o fluxo de trabalho quando recebe uma chamada em um endpoint de API. |
| **Quando um novo e-mail chega (Office 365)**| Inicia o fluxo de trabalho sempre que um novo e-mail é recebido em uma caixa de entrada específica.|
| **Quando um arquivo é criado (OneDrive, Dropbox)** | Dispara o fluxo de trabalho quando um novo arquivo é adicionado a uma pasta monitorada. |
| **Quando um tweet é postado (Twitter)** | Inicia o fluxo de trabalho quando um novo tweet corresponde a uma busca específica. |

#### Exemplos de ações:

  - Enviar um e-mail (Office 365 Outlook, Gmail).
  - Adicionar uma linha a uma planilha (Google Sheets, Excel Online).
  - Criar um registro em um sistema de CRM (Salesforce, Dynamics 365).
  - Executar uma consulta SQL (SQL Server).
  - Chamar uma Azure Function para processamento de dados personalizado.
  - Controlar o fluxo com condições (if/else), laços (for each) e switches.

-----

### Como criar um aplicativo lógico (Portal do Azure)

1.  **Acesse o portal do Azure:** Faça login em [portal.azure.com](https://www.google.com/search?q=https://portal.azure.com).
2.  **Crie um recurso:**
      * Clique em "Criar um recurso".
      * Procure por "Aplicativo Lógico" e selecione-o.
      * Clique em "Criar".
3.  **Configure os detalhes:**
      * Selecione sua Assinatura e Grupo de Recursos.
      * Dê um nome ao seu Aplicativo Lógico.
      * Escolha a Região onde ele será hospedado.
      * Selecione o tipo de plano: **Consumo** (pago por execução, ideal para a maioria dos cenários) ou **Standard** (oferece mais recursos de computação e rede com preço previsível).
4.  **Acesse o designer de Aplicativos Lógicos:**
      * Após a implantação, vá para o recurso criado. Você será direcionado para o Designer de Aplicativos Lógicos.
      * Normalmente, você começa com um vídeo introdutório e modelos comuns. Você pode começar com um "Aplicativo Lógico em Branco".
5.  **Construa o fluxo de trabalho:**
      * **Escolha o gatilho:** Pesquise e selecione o conector e o evento que iniciarão seu fluxo de trabalho (ex: "Quando uma solicitação HTTP é recebida").
      * **Adicione ações:** Clique em "+ Nova etapa". Pesquise e selecione os conectores e as ações desejadas. Configure cada ação usando os dados das etapas anteriores (conteúdo dinâmico).
6.  **Salve e Execute:**
      * Após configurar seu fluxo de trabalho, clique em "Salvar".
      * O Aplicativo Lógico está ativo e aguardando o evento do gatilho para ser executado. Você pode monitorar o histórico de execuções na guia "Visão Geral".

-----

### Modelo de preços

  - **Plano de Consumo:** O modelo mais comum, onde você paga com base no número de execuções de gatilhos, ações e conectores. É altamente econômico para fluxos de trabalho que não são executados constantemente, pois não há custo quando o aplicativo está ocioso.
  - **Plano Standard:** Executa o Logic Apps em uma infraestrutura de computação dedicada, semelhante ao plano do Serviço de Aplicativo. O preço é baseado nos recursos de vCPU e memória alocados. Este plano é ideal para cenários que exigem isolamento de rede, mais controle de desempenho e a capacidade de executar fluxos de trabalho com estado (*stateful*) e sem estado (*stateless*).

-----

### Casos de uso comuns

  - **Integração de aplicações empresariais (EAI):** Conectar sistemas legados a aplicações modernas na nuvem, como sincronizar dados de clientes entre um CRM e um sistema de ERP.
  - **Business-to-Business (B2B):** Automatizar a troca de documentos eletrônicos (EDI), como pedidos de compra e faturas, entre parceiros de negócios.
  - **Automação de Processos de Negócios:** Criar fluxos de aprovação de documentos, onde um arquivo carregado no SharePoint inicia um processo que envia e-mails de notificação para aprovação.
  - **Coleta e Processamento de Dados:** Monitorar redes sociais em busca de menções a uma marca e salvar os resultados em um banco de dados para análise de sentimento.
  - **Orquestração de Microsserviços:** Coordenar a execução de várias Azure Functions ou APIs para realizar uma tarefa complexa.

---

## Comparativo: Azure Functions vs. Logic Apps vs. WebJobs

No ecossistema do Microsoft Azure, existem diversas maneiras de executar código e automatizar processos em segundo plano. Três dos serviços mais proeminentes para essas tarefas são **Azure Functions**, **Azure Logic Apps** e **Azure WebJobs**. Embora possam parecer sobrepostos, cada um possui características, modelos de desenvolvimento e casos de uso ideais distintos.

Compreender as diferenças entre eles é fundamental para arquitetar soluções eficientes, escaláveis e com o custo otimizado no Azure.

-----

### Visão Geral

  * **Azure Functions:** Um serviço de computação sem servidor (*serverless*) e orientado a eventos. É uma abordagem "código primeiro" (*code-first*), onde você escreve pequenos trechos de código (funções) que respondem a gatilhos, como uma requisição HTTP, uma nova mensagem em uma fila ou um agendamento. O Azure gerencia toda a infraestrutura e a escalabilidade.

  * **Azure Logic Apps:** Uma plataforma de integração sem servidor (*serverless*) e de baixo código (*low-code*). É uma abordagem "designer primeiro" (*designer-first*), onde você cria fluxos de trabalho (workflows) visualmente, orquestrando e conectando centenas de serviços (conectores) por meio de uma interface gráfica. O foco é a integração e a automação de processos de negócios.

  * **Azure WebJobs:** Um recurso do **Azure App Service** que permite executar scripts ou programas em segundo plano, no mesmo contexto de um aplicativo web. Não é um serviço independente e sua escalabilidade está diretamente atrelada ao plano do App Service. É ideal para adicionar tarefas de background a uma aplicação web existente.

-----

### Tabela Comparativa Detalhada

| Característica | Azure Functions | Azure Logic Apps | Azure WebJobs |
| :--- | :--- | :--- | :--- |
| **Modelo Principal** | **Código Primeiro (Code-First)** | **Designer Primeiro (Low-Code)** | **Código Primeiro (Code-First)** |
| **Abstração** | Função como serviço (FaaS) | Fluxo de trabalho como serviço (WaaS) | Tarefa em segundo plano |
| **Foco Principal** | Execução de lógica de negócios personalizada e orientada a eventos. | Integração de sistemas e orquestração de processos de negócios. | Executar tarefas de background para uma aplicação web existente. |
| **Desenvolvimento** | Escrita de código em linguagens como C\#, Python, JavaScript, Java, etc. | Designer visual no Portal do Azure ou Visual Studio. | Scripts (.bat, .ps1) ou programas (.exe, .jar) C\#, etc. |
| **Gatilhos** | Ampla gama de gatilhos (HTTP, Filas, Blob, Cosmos DB, Timer, etc.). | Centenas de conectores com gatilhos (Office 365, Salesforce, SQL, etc.). | Agendado, contínuo ou manual. Gatilhos do SDK (Filas, Blobs). |
| **Hospedagem e Escala** | **Serverless (Consumo):** Escala automática, paga por execução. \<br\> **Premium/App Service:** Instâncias pré-aquecidas. | **Serverless (Consumo):** Escala automática, paga por ação. \<br\> **Standard:** Desempenho e rede aprimorados. | Atrelado ao plano do **Azure App Service**. A escala é manual, junto com a aplicação web. |
| **Gerenciamento de Estado** | Sem estado (Stateless) por padrão. O estado pode ser gerenciado com **Durable Functions**. | Com estado (Stateful) por padrão, mantém o histórico de execuções. Opção para sem estado (Stateless). | Requer implementação manual de estado (ex: usando banco de dados). |
| **Conectividade** | Por meio de *bindings* de entrada e saída (código declarativo para conectar serviços). | Centenas de conectores pré-construídos que simplificam a integração. | Requer o uso de SDKs e bibliotecas nos scripts/programas para conectar serviços. |
| **Preço** | **Plano de Consumo:** Paga por execução e uso de recursos. \<br\> **Outros Planos:** Custo baseado no plano de hospedagem. | **Plano de Consumo:** Paga por execução de conector/ação. \<br\> **Plano Standard:** Custo por hora baseado em vCPU/memória. | **Sem custo adicional.** O custo está incluído no plano do App Service que hospeda a aplicação web. |

-----

### Quando escolher qual serviço?

A escolha entre Functions, Logic Apps e WebJobs depende diretamente dos requisitos do seu projeto.

#### Escolha Azure Functions quando:

  * Você precisa executar uma lógica de negócios complexa e personalizada que é melhor expressa em código.
  * Você quer criar APIs HTTP (microsserviços) leves e escaláveis.
  * A tarefa é de curta duração e orientada a eventos, como processamento de imagens, validação de dados ou transformação de mensagens.
  * Você precisa de mais controle sobre o ambiente de execução e as dependências do código.
  * **Cenário de Exemplo:** Ao fazer upload de uma imagem em um Blob Storage (gatilho), uma Function é disparada para redimensioná-la, aplicar uma marca d'água e salvar em outro contêiner.

#### Escolha Azure Logic Apps quando:

  * O objetivo principal é **integrar múltiplos serviços** (ex: Salesforce, Office 365, SAP, SQL Server) com o mínimo de código.
  * Você precisa automatizar um processo de negócio que pode ser modelado visualmente como um fluxo de trabalho.
  * A necessidade é de rápida prototipagem e desenvolvimento de fluxos de integração complexos.
  * Usuários de negócios ou integradores, e não apenas desenvolvedores, precisam entender ou modificar o fluxo.
  * **Cenário de Exemplo:** Quando um novo item é adicionado a uma lista do SharePoint (gatilho), um Logic App inicia um fluxo de aprovação enviando um e-mail via Office 365. Se aprovado, ele insere um registro no Dynamics 365; se reprovado, posta uma mensagem no Microsoft Teams.

#### Escolha Azure WebJobs quando:

  * Você **já possui uma aplicação no Azure App Service** (como um site ASP.NET) e precisa adicionar tarefas de background a ela.
  * Você quer que o ciclo de vida e a implantação da tarefa de background estejam atrelados à sua aplicação web principal.
  * A tarefa é de longa duração ou intensiva em CPU/memória e você prefere provisionar e gerenciar os recursos através do plano do App Service.
  * Você precisa de mais controle sobre o objeto `JobHost` e políticas de repetição que não estão disponíveis no Functions.
  * **Cenário de Exemplo:** Uma aplicação web existente precisa, a cada hora, gerar um relatório a partir de seu banco de dados e enviá-lo por e-mail. Um WebJob agendado é a forma mais simples de adicionar essa funcionalidade sem criar um novo serviço.

### Conclusão: Use-os Juntos\!

A decisão não precisa ser mutuamente exclusiva. Na verdade, a força da plataforma Azure reside na combinação desses serviços. É muito comum que um **Logic App** orquestre um fluxo de trabalho de alto nível e, para uma etapa que exige uma transformação de dados complexa ou uma lógica de negócios customizada, ele **chame uma Azure Function** para realizar o trabalho pesado. WebJobs, por sua vez, continuam sendo uma solução robusta e pragmática para estender aplicações existentes no App Service.