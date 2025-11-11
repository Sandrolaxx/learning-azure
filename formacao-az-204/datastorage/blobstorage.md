# Azure Blob Storage 

Na prova o foco é como interagir via código (SDK) e como gerenciar o acesso aos dados.

### Hierarquia e Tipos de Blob

Você precisa entender a estrutura para saber qual classe do SDK instanciar.

  * **Tipos de Blobs (Cai na Prova):**
    1.  **Block Blobs:** O padrão para armazenar arquivos (imagens, vídeos, documentos). Feito de blocos que podem ser carregados em paralelo.
    2.  **Append Blobs:** Otimizado para operações de "anexar". Ideal para **Logs** (você só adiciona linhas ao final, não edita o meio).
    3.  **Page Blobs:** Arquivos de acesso aleatório (VHDs de máquinas virtuais). Raramente cobrado para devs, mas bom saber que existe.

-----

### Camadas de Acesso (Access Tiers) e Ciclo de Vida

A Microsoft vai te dar um cenário e perguntar qual a forma mais barata de armazenar.

| Camada (Tier) | Descrição | Custo Armazenamento | Custo Acesso | Requisito Mínimo |
| :--- | :--- | :--- | :--- | :--- |
| **Hot (Quente)** | Dados acessados frequentemente. | Alto ⬆️ | Baixo ⬇️ | N/A |
| **Cool (Frio)** | Acesso infrequente (backups curto prazo). | Médio | Médio | 30 dias |
| **Cold (Curitiba)** | Acesso muito raro. | Baixo | Alto | 90 dias |
| **Archive** | Dados offline (compliance). **Não é acessível imediatamente**. | Muito Baixo ⬇️ | Muito Alto ⬆️ | 180 dias |

  * **Reidratação (Rehydration):** Para ler um arquivo no Archive, você precisa "reidratá-lo" (mover para Hot/Cool). Isso demora **horas** (Standard) ou minutos (High Priority - mais caro).
  * **Lifecycle Management (Gerenciamento de Ciclo de Vida):**
      * Não escreva script para mover arquivos de Hot para Cool. Use as **Regras de Ciclo de Vida** (JSON policy) no portal.
      * *Exemplo:* "Se não for modificado por 30 dias, mova para Cool. Se 365 dias, mova para Archive. Se 2 anos, delete."

-----

### Segurança e Controle de Acesso (Tópico importante⚠️)

Essa é a parte mais técnica. Como dar acesso ao seu blob sem dar a chave mestra da conta?

#### A. Shared Access Signatures (SAS)

É uma URI que concede direitos de acesso restritos (tempo, permissões, IP) aos recursos.

  * **Service SAS:** Acesso a um recurso específico (ex: apenas um blob).
  * **Account SAS:** Acesso a nível da conta (vários serviços).
  * **User Delegation SAS (A Queridinha da Prova):**
      * Protegida por credenciais do **Microsoft Entra ID** (antigo Azure AD) em vez da chave de armazenamento.
      * **Melhor Prática:** É a forma mais segura de gerar SAS, pois não compromete a chave da conta e você pode revogar permissões no AD.

#### B. Access Policies (Stored Access Policies)

Se você gera um SAS Token para 100 usuários com validade de 1 ano e percebe que vazou, como você cancela? Você não consegue, a menos que mude a chave da conta (o que quebra tudo).

  * **Solução:** Crie uma **Stored Access Policy** no container. Gere os SAS Tokens atrelados a essa política.
  * **Revogação:** Para cancelar o acesso de todos, basta deletar ou alterar a política no container.

-----

### Bloqueio e Concorrência (Leasing)

Como evitar que dois processos editem o mesmo arquivo ao mesmo tempo?

  * **Lease Blob (Arrendamento):** Funciona como um "Lock" (trava).
  * **Tipos de Lease:**
      * **Infinite:** Ninguém toca até você liberar.
      * **Finite (15 a 60 segundos):** Se você morrer (processo travar), o lock expira sozinho e libera o arquivo.
  * **No SDK:** Você precisa enviar o `LeaseId` no header da requisição para conseguir editar um blob que tem lease. Se não enviar (ou enviar errado), recebe um erro `412 Precondition Failed`.

-----

### Metadados (Metadata)

Você pode salvar pares chave-valor personalizados no cabeçalho do arquivo.

  * **Uso:** Salvar "Status=Processado" ou "Autor=Joao" diretamente no arquivo.
  * **Index Tags:** Diferente dos metadados normais, as **Blob Index Tags** permitem que você pesquise/filtre blobs (ex: `Select * where Project = 'X'`). Metadados normais não são indexáveis nativamente para busca rápida.

-----

### SDK do .NET (O que decorar)

A prova pode mostrar trechos de código C\#. Fique atento a estas classes:

1.  `BlobServiceClient`: O ponto de entrada (nível da conta).
2.  `BlobContainerClient`: Para criar containers ou listar blobs.
3.  `BlobClient`: Para upload, download e delete de um arquivo específico.

**Snippet Clássico de Upload:**

```csharp
// Conecta
var serviceClient = new BlobServiceClient(connectionString);
var containerClient = serviceClient.GetBlobContainerClient("meu-container");

// Referência ao blob
var blobClient = containerClient.GetBlobClient("foto.jpg");

// Upload (Sobrescrevendo se existir)
await blobClient.UploadAsync(filePath, overwrite: true);
```

-----

### Resumo de "Pegadinhas" AZ-204

1.  **Soft Delete:** Permite recuperar blobs deletados (Lixeira). Mas atenção: Você paga pelo armazenamento do dado na lixeira\!
2.  **Versioning vs Snapshots:**
      * *Snapshot:* Cópia somente leitura tirada manualmente num ponto do tempo.
      * *Versioning:* Automático. Mantém o histórico de todas as alterações.
3.  **Immutability (WORM - Write Once, Read Many):** Se a questão falar sobre "compliance legal" onde dados não podem ser apagados por 5 anos, a resposta é **Immutable Storage** (Time-based retention).

-----

### Simulado Rápido

**Cenário:** Você tem um aplicativo que processa logs. Várias instâncias do app escrevem no mesmo arquivo de log simultaneamente. Ocasionalmente, dados estão sendo perdidos ou corrompidos devido à concorrência.
**Requisito:** Garantir que apenas uma instância escreva por vez, mas se a instância travar, o arquivo não pode ficar bloqueado para sempre.

**Qual recurso você usa?**

A) Snapshot.
B) Infinite Lease.
C) Finite Lease (15-60s).
D) User Delegation SAS.

*(Resposta abaixo)*

.

.

.

.


**Resposta:** **C) Finite Lease.** O Lease garante exclusividade (lock). O fato de ser "finito" resolve o problema de "se a instância travar", pois o lock expira automaticamente permitindo que outra instância assuma.

---

## Exemplo de troca ciclo vida arquivos

Criação de regra:

![Criação regra](https://github.com/user-attachments/assets/8b8b9b6f-7de2-4f59-b65e-b251aa2fd6fc)

Alteração manual em cada arquivo:
![Alteração no arquivo](https://github.com/user-attachments/assets/4b138eb4-7b33-4616-a83b-207e2132dfd5)