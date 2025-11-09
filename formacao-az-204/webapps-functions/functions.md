# Azure Functions (Serverless) 

É o coração da computação orientada a eventos. Aqui você não gerencia servidores, você gerencia **eventos**.

### Triggers e Bindings (Gatilhos e Vínculos)

A "regra de ouro" do Azure Functions é: **Escreva menos código de infraestrutura (boilerplate).**

* **Trigger (Gatilho):** O evento que inicia a função.
    * **Regra:** Uma função só pode ter **UM** trigger.
    * **Exemplos:** HTTP (REST API), Timer (Agendado), Blob (Arquivo criado), Queue (Mensagem na fila), Cosmos DB (Dado alterado).
* **Binding (Vínculo):** Conecta dados de entrada e saída declarativamente.
    * **Regra:** Você pode ter múltiplos bindings (Input e Output).
    * **Vantagem:** Você não precisa escrever código para abrir conexão com o banco ou storage; o Azure injeta o objeto pronto para uso.
    * **Input Binding:** Traz dados para a função (ex: Ler um documento do Cosmos DB baseado no ID que veio na URL).
    * **Output Binding:** Envia dados para fora (ex: Salvar o resultado numa fila ou enviar um email via SendGrid).

> **💡 Dica de Prova:** Se a questão pedir para "processar uma imagem assim que ela for carregada no Blob Storage e salvar uma miniatura", a resposta é: **Blob Trigger** (entrada) e **Blob Output Binding** (saída). Não use "Event Grid" a menos que precise filtrar eventos complexos antes de acionar a função.

---

### Planos de Hospedagem (Hosting Plans) ⚠️

Este é o tópico onde a maioria dos candidatos perde pontos. Você precisa saber escolher o plano baseado em **Custo, Performance e Rede**.

| Plano | Pagamento | Cold Start (Atraso Inicial) | Duração Máxima | Quando Escolher? |
| :--- | :--- | :--- | :--- | :--- |
| **Consumption** (Consumo) | Paga por execução. | **Sim** (Pode demorar se ficar ocioso). | 5 min (padrão) / 10 min (máx). | Tráfego imprevisível, custo baixo, jobs curtos. |
| **Premium** | Paga por EP (Instância pré-aquecida). | **Não** (Instâncias sempre prontas). | Ilimitado (Tecnicamente 60min garantidos). | Precisa de **VNET Integration** (acessar banco privado), sem Cold Start, hardware potente. |
| **Dedicated** (App Service) | Preço fixo mensal da VM. | **Não** (Se "Always On" estiver ligado). | Ilimitado. | Você já tem um App Service Plan sobrando ou precisa de ambiente isolado/previsível. |

> **Pegadinha Clássica:** "Você precisa de uma função que rode por 45 minutos para processar um relatório."
> * Resposta: **Premium** ou **Dedicated**. (O plano Consumption morre em 10 minutos).

---

### Durable Functions (Funções Duráveis)

Azure Functions padrão são *stateless* (sem memória). Durable Functions permitem criar fluxos de trabalho complexos e *stateful* (com estado) em código (C#, JS, Python, Java).

Você precisa memorizar os **Padrões de Aplicação (Application Patterns)**:

1.  **Function Chaining (Encadeamento):** Executar F1, depois F2, depois F3. O output de uma é input da próxima.
2.  **Fan-out/Fan-in:** F1 dispara 100 execuções de F2 em paralelo (Fan-out). F3 espera **todas** terminarem para consolidar o resultado (Fan-in).
3.  **Async HTTP APIs:** Para processos longos. O cliente chama a API, recebe um "202 Accepted" com uma URL de status, e fica consultando (polling) até terminar.
4.  **Monitor:** Uma função que fica num loop verificando se uma condição externa mudou (ex: aguardar um arquivo aparecer).
5.  **Human Interaction:** O fluxo para e espera um evento externo (ex: aprovação de um gerente via clique em email) por dias, sem gastar processamento. Timeout automático se demorar demais.

---

### Desenvolvimento e Ferramentas
* **Azure Functions Core Tools:** Ferramenta de linha de comando para rodar e debugar funções **localmente** no seu PC.
* **Visual Studio / VS Code:** Você desenvolve local, testa com o emulador de Storage (Azurite) e depois publica.
    * **Importante:** Desenvolver no Portal do Azure é limitado (não tem IntelliSense bom, difícil debugar). A prova favorece o fluxo "Desenvolvimento Local -> Deploy via CI/CD ou Zip Deploy".

---

## Functions na prática

Criada funções na Azure mostrando o funcionamento de um Http Trigger simples, Timer Trigger e um Http Trigger que consome dados do blob storage. Projeto está na pasta **/funcsamples** e foi realizado o deploy na Azure em uma function existente com o comando.

```bash
func azure functionapp publish azfsandrolaxx
```

### Importante

Antes de realizar esse comando, no caso do TypeScript é necessário realizar o build do projeto para js. Também é claro, executar o comando **az login** primeiro. **azfsandrolaxx** é o nome da função existente. Necessário estar na raiz da pasta que contém o projeto.

Três triggers da Function:
![Triggers](https://github.com/user-attachments/assets/12bcf4ff-557c-49f7-ba01-05fc5b043013)

Print dos logs da execução da Function com Timer na Azure:
![Trigger Timer](https://github.com/user-attachments/assets/b38009b8-da73-44a4-a2fd-ecfec91b8802)

Arquivo json feito upload no blob storage:
![Arquivo json](https://github.com/user-attachments/assets/469be519-dc52-4e99-94b8-724a439a9c15)

Response da execução do http trigger que busca o arquivo json e retorna ele:
![Trigger Http integrado](https://github.com/user-attachments/assets/469be519-dc52-4e99-94b8-724a439a9c15)
