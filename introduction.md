# Introdução

## Computação em nuvem

A computação em nuvem é o fornecimento de serviços de computação pela Internet, habilitando inovações mais rápidas, recursos flexíveis e economias de escala.

Nesse contexto podemos ter acesso a computing, storage e tudo isso feito via network.

### Nuvem privada

Nosso on-premisses. as organização criam um ambiente em nuvem em seu datacenter. As organizações são responsáveis por operar os serviços que fornecem. Não fornece acesso aos usuários fora da organização.

Hardware e lincenças todas providas pela organização, isso envolve **CapEx, recursos e investimentos próprios**.

### Nuvem pública

Pertence a serviços de nuvem ou provedor de hosting. Fornece recursos e serviços a várias organizações e usuários. Acessada via conexão de rede segura(Geralmente pela Internet).

Tudo é **OpEx, serão despesas operacionais, mês a mês**. Pagamento conforme o uso.

### Nuvem híbrida

Combina nuvens públicas e privadas para permitir que os aplicativos sejam executados no local mais adequado.

---

## Benefícios da nuvem

* Alta disponibilidade: A aplicação está sempre disponível, redundância de região e etc.
* Elasticidade: Chegou o topo de algum indicador, ele aumenta dinamicamente e após volta aos seus valores iniciais. 
* Escalabilidade: Aumentar os recursos de maneira direta, ir de 8GB de ram para 16GB, fixo.
* Confiabilidade: Consigo medir tudo que está na nuvem, gerando uma confiança, também SLA.
* Previsibilidade: É possível saber os custos, mensais de tudo que está sendo utilizado e ter previsão.
* Segurança: Permite criar níveis de acesso aos recursos. Microsoft Defender for Cloud nos auxilia com esse ponto, até em outros provedores.
* Governança: Consigo criar normas.
* Gerenciabilidade: Eu tenho um controle de todos os usuários, do que cada um pode fazer.

Podemos ver muitos desses pilares na ferramenta do [Advisor](https://learn.microsoft.com/pt-br/azure/advisor/advisor-overview).

---

## Tipos de serviço de nuvem: IaaS, Paas e SaaS

### IaaS (Infraestrutura como Serviço)  
- Controle total sobre servidores, armazenamento e rede.  
- Alta flexibilidade, mas exige mais responsabilidade do cliente (atualizações, segurança).  
- Exemplo: máquinas virtuais configuradas manualmente.

---

### PaaS (Plataforma como Serviço)  
- Ambiente pronto para desenvolvimento e execução de aplicações.  
- Provedor cuida da infraestrutura e SO; cliente cuida apenas do código e dados.  
- Ideal para APIs, microserviços e apps web.  
- Exemplos: Heroku, Google App Engine, AWS Elastic Beanstalk.

---

### SaaS (Software como Serviço)  
- Usuário consome aplicações prontas via internet.  
- Nenhuma preocupação com infraestrutura ou plataforma.  
- Cliente cuida apenas do uso e dados.  
- Exemplos: Gmail, Microsoft 365, Salesforce.

---

### Modelo de responsabilidade

​O Modelo de Responsabilidade Compartilhada é um conceito fundamental na computação em nuvem que define as obrigações de segurança e gerenciamento entre o provedor de serviços em nuvem (CSP) e o cliente. Essas responsabilidades variam conforme o tipo de serviço contratado: Infraestrutura como Serviço (IaaS), Plataforma como Serviço (PaaS) ou Software como Serviço (SaaS).

![modelo responsabilidade](https://learn.microsoft.com/en-us/training/wwl-azure/describe-cloud-service-types/media/shared-responsibility-b3829bfe.svg)

A imagem mostra **como as responsabilidades são divididas** entre cliente e provedor (Microsoft):

| Ator                               | Responsável por recurso                                      |
|--------------------------------------|-------------                              |
| **Cliente**  | Dados, dispositivos, contas e identidades |
| **De acordo com modelo**          | Aplicações, sistema, rede, diretórios     | 
| **Microsoft**       | Hardware, rede física, datacenter         |

Resumo

- Quanto **mais alto o nível do serviço (SaaS)**, **menos responsabilidade técnica** para o cliente.
- Quanto **mais baixo (IaaS ou On-Prem)**, **mais controle e mais responsabilidade** do cliente.

---

## Componentes da arquitetura do Azure

### Regiões
- Conjunto geográfico de data centers.
- Permite hospedar recursos próximos aos usuários finais.
- Exemplo: *Brazil South*, *East US*.

### Zonas de Disponibilidade
- Conjuntos de data centers fisicamente separados dentro de uma mesma região.
- Garantem alta disponibilidade e tolerância a falhas.
- Ideal para aplicações críticas.

### Pares de Região (Region Pairs)
- Regiões emparelhadas para replicação geográfica automática e recuperação de desastres.
- Atualizações de manutenção são feitas de forma alternada.

### Regiões Soberanas
- Regiões separadas para atender requisitos jurídicos, regulatórios ou de conformidade específicos.
- Exemplo: *Azure Government (EUA)*, *Azure China*.

### Recursos
- Qualquer item gerenciado no Azure: VMs, bancos de dados, redes, etc.
- São instanciados a partir de serviços.

### Assinaturas (Subscriptions)
- Contêiner lógico que agrupa recursos para faturamento e controle de acesso.
- Permite definir cotas, políticas e permissões.

### Grupos de Gerenciamento (Management Groups)
- Hierarquia acima das assinaturas.
- Usado para aplicar políticas e controle de acesso em múltiplas assinaturas de forma centralizada.

---

## Serviço de computação, rede e contêineres

### Serviços de Computação

Os serviços de computação oferecem diversas opções para executar cargas de trabalho, desde máquinas virtuais (VMs) tradicionais até soluções modernas como contêineres e funções serverless. Com eles, é possível escalar aplicações de forma flexível, automatizar tarefas e atender a diferentes modelos de desenvolvimento, desde web apps até microsserviços.

**Os serviços disponíveis são:**
- Azure Virtual Machines (VMs): máquinas virtuais que permitem executar sistemas operacionais e aplicativos personalizados.
- Azure App Service: plataforma para hospedagem de aplicativos web, APIs e backends móveis sem gerenciar infraestrutura.
- Azure Functions: computação serverless para execução de código sob demanda, baseado em eventos.
- Azure Kubernetes Service (AKS): gerenciamento de clusters Kubernetes para orquestração de contêineres.
- Azure Container Instances (ACI): execução rápida e isolada de contêineres sem necessidade de gerenciar VMs.
- Azure Batch: execução de grandes volumes de tarefas paralelas ou em lotes na nuvem.
- Azure Service Fabric: plataforma distribuída para construir e gerenciar microsserviços e contêineres.

### Serviços de Rede

Já os serviços de rede garantem conectividade, desempenho e segurança para os recursos em nuvem. Eles permitem criar redes virtuais isoladas, estabelecer conexões seguras com ambientes locais, balancear carga de tráfego entre aplicações e proteger sistemas contra ataques. Esses serviços são essenciais para garantir uma comunicação eficiente e confiável entre os componentes da infraestrutura.

**Os serviços disponíveis são:**
- Azure Virtual Network (VNet): rede privada e isolada para provisionar e gerenciar recursos do Azure.
- Azure Load Balancer: balanceador de carga de camada 4 para distribuir tráfego de rede entre VMs.
- Azure Application Gateway: balanceamento de carga de camada 7 com firewall de aplicativo web (WAF) integrado.
- Azure VPN Gateway: conexão segura entre redes locais e o Azure por meio de VPNs.
- Azure ExpressRoute: conexão privada e dedicada entre a infraestrutura local e o Azure.
- Azure DNS: serviço para hospedagem de domínios DNS com alta disponibilidade e desempenho.
- Azure Front Door: aceleração global de aplicativos com balanceamento de carga, cache e segurança na borda.

Juntos, computação e rede formam a base para arquiteturas escaláveis, resilientes e seguras no Azure.

### Serviços de contêiner

Os serviços de contêiner do Azure oferecem soluções flexíveis para empacotar, implantar e gerenciar aplicações de forma leve e portátil, aproveitando a escalabilidade e automação da nuvem.

Com o **Azure Kubernetes Service (AKS)**, é possível orquestrar contêineres em larga escala, automatando tarefas como balanceamento de carga, atualizações e gerenciamento de estado. É ideal para aplicações distribuídas e arquiteturas baseadas em microsserviços.

Para cenários mais simples e rápidos, o **Azure Container Instances (ACI)** permite executar contêineres sob demanda, sem a necessidade de configurar ou gerenciar infraestrutura subjacente. Ele é ideal para cargas temporárias, testes ou processos isolados.

Esses serviços proporcionam agilidade no desenvolvimento, consistência nos ambientes e maior eficiência operacional, sendo elementos-chave em estratégias modernas de DevOps e computação em nuvem.

---

## Armazenamento

O armazenamento no Azure é um pilar fundamental para aplicações e serviços em nuvem, oferecendo soluções escaláveis, seguras e altamente disponíveis para diferentes tipos e volumes de dados. Ele é projetado para atender a diversos cenários, desde aplicações web até big data e arquivamento.

### Serviços

A plataforma disponibiliza **diversos serviços de armazenamento**, como o **Azure Blob Storage**, ideal para grandes volumes de dados não estruturados; o **Azure Files**, que fornece compartilhamentos de arquivos via protocolo SMB; e os **discos gerenciados**, usados por máquinas virtuais para garantir desempenho e persistência. Além disso, há suporte para armazenamento estruturado em bancos de dados gerenciados como o **Azure SQL Database** e o **Azure Cosmos DB**.

### Redundância de armazenamento

Um dos destaques do Azure é a **redundância de armazenamento**, que protege os dados contra falhas físicas e indisponibilidades. O usuário pode escolher entre diferentes modelos de replicação, como **Locally Redundant Storage (LRS)**, **Zone-Redundant Storage (ZRS)**, **Geo-Redundant Storage (GRS)** e **Read-Access GRS (RA-GRS)**, de acordo com os requisitos de durabilidade e recuperação de desastres.

### Camadas de acesso

Os serviços oferecem **camadas de acesso** (hot, cool e archive), que ajudam a otimizar custos com base na frequência de acesso aos dados. Dados acessados com frequência permanecem na camada *hot*, enquanto os acessados ocasionalmente ou raramente são armazenados em *cool* ou *archive*, com custos menores de armazenamento.

### Pontos de extremidade

Os **pontos de extremidade de armazenamento** (storage endpoints) permitem o acesso aos dados por meio de protocolos padrão como HTTP/HTTPS e SMB, garantindo integração fácil com aplicações e serviços diversos, tanto na nuvem quanto no ambiente local.

### Azure Data Box

Para grandes volumes de dados que precisam ser transferidos para a nuvem, o Azure oferece soluções como o **Azure Data Box**, um dispositivo físico seguro que permite importar dados para o Azure de forma eficiente, quando a transferência pela rede não é viável.

Com essas funcionalidades, o armazenamento no Azure garante não apenas alta disponibilidade e desempenho, mas também flexibilidade, segurança e economia, adaptando-se a diversos tipos de cargas de trabalho e exigências de negócios.