# Dimensionamento App Service

O dimensionamento (Scaling) no Azure App Service é um dos pilares da nuvem: **pagar apenas pelo que usa e aguentar o tranco quando a demanda sobe.**

Para a certificação AZ-204, você precisa diferenciar claramente os conceitos de **Scale Up** vs **Scale Out** e entender as nuances entre o Autoscale (regrado) e o Automatic Scaling (elástico).

![Painel com as opções](https://github.com/user-attachments/assets/3df70bbb-4fff-4b6a-8b44-acb92d99256a)

---

### Scale Up vs. Scale Out (A Base)

Antes de entrar nos modos (manual/auto), você precisa saber **para onde** está crescendo.

* **Scale Up (Vertical):**
    * **O que é:** Mudar o tamanho da máquina (Tier). Ex: Sair do plano B1 (Basic) para o P1v2 (Premium).
    * **Resultado:** Mais CPU, RAM e **novas funcionalidades** (como Slots, VNET, Backups) para a mesma instância.
    * **Quando usar:** Quando uma única requisição precisa de muita memória ou você precisa habilitar features bloqueadas no plano atual.

* **Scale Out (Horizontal):**
    * **O que é:** Aumentar o número de instâncias (cópias) da sua aplicação (VMs). Ex: Sair de 1 instância para 5 instâncias.
    * **Resultado:** Capacidade de atender mais usuários simultâneos.
    * **Quando usar:** Quando o problema é volume de tráfego. **É aqui que focam as regras de Autoscale.**

---

### Dimensionamento Manual (Manual Scale)

É o método mais simples de **Scale Out**.

* **Como funciona:** Você vai no portal e arrasta uma barra: "Quero 3 instâncias fixas".
* **Comportamento:** O Azure provisiona as 3 VMs e o Load Balancer distribui o tráfego entre elas.
* **Custo:** Você paga por 3 instâncias, 24 horas por dia, usando elas ou não.
* **Uso:** Testes de carga, ambientes de desenvolvimento ou cenários onde a carga é 100% constante e conhecida.

---

### Autoscale (Escalonamento Automático Baseado em Regras)

Disponível nos planos **Standard** e superiores. Aqui você define **regras** explícitas para o Azure adicionar ou remover máquinas.

#### Como funciona na prova?

Você cria um perfil de Autoscale com duas partes obrigatórias:
1.  **Regra de Scale Out (Crescer):** "Se a CPU média for > 70% por 10 minutos, adicione 1 instância".
2.  **Regra de Scale In (Reduzir):** "Se a CPU média for < 30% por 10 minutos, remova 1 instância".

> **⚠️ Pegadinha de Prova:** Se você criar uma regra para crescer, mas esquecer a regra para diminuir, o Azure **nunca** vai reduzir a contagem de instâncias, e sua fatura virá alta. O Scale In não é automático, é configurado.

#### Funcionalidades Chave:

* **Métricas:** CPU, Memória, Tamanho da Fila (HTTP Queue), Data/Disk Queue.
* **Schedule (Agendamento):** Você pode ter regras diferentes para horários diferentes.
    * *Ex:* "Segunda a Sexta, mínimo de 5 instâncias. Fim de semana, mínimo de 2".
* **Flapping (Oscilação):** O Azure possui um mecanismo interno que impede o "liga-desliga" frenético. Se a ação de remover uma instância for fazer a CPU subir para 80% (causando um novo Scale Out imediato), o Azure **cancela** a ação de redução para manter a estabilidade.

---

### Automatic Scaling (Elástico / Burst)

Esta é a nova geração de escalonamento, disponível apenas nos planos **Premium V2 e V3**. É muito mais simples e rápido que o Autoscale tradicional.

#### O Conceito "Pre-Warmed" (Pré-aquecido)

Diferente do Autoscale padrão (onde a nova VM leva um tempo para bootar e entrar no load balancer), no Automatic Scaling você define **Instâncias Pré-aquecidas**.

* **Como funciona:**
    * Você define, por exemplo, que quer ter sempre **1 instância "no banco de reservas" (buffer)** já ligada e pronta.
    * Quando o tráfego aumenta, o Azure joga o tráfego para essa reserva imediatamente (zero cold start) e já começa a preparar a próxima reserva.

#### Diferenças para o Autoscale Padrão:

1.  **Sem Regras Complexas:** Você não define "CPU > 70%". Você apenas define o **Máximo de Burst** (ex: até 20 instâncias). A plataforma decide sozinha quando escalar baseada em heurísticas de tráfego HTTP.
2.  **Velocidade:** É muito mais rápido para lidar com picos repentinos (slashdot effect).
3.  **Configuração:** É apenas uma barra deslizante: "Maximum Burst".

---

### Resumo Comparativo para AZ-204

| Característica | Autoscale (Padrão) | Automatic Scaling (Premium/Elástico) |
| :--- | :--- | :--- |
| **Plano Mínimo** | Standard | Premium V2 / V3 |
| **Gatilho** | Métricas definidas por você (CPU, RAM, Horário) | Tráfego HTTP (gerenciado pelo Azure) |
| **Configuração** | Complexa (Regras de Out + Regras de In) | Simples (Define Min/Max e Pre-warm) |
| **Velocidade** | Lento (Reativo às médias de minutos) | Rápido (Burst imediato com pre-warmed) |
| **Scale In** | Baseado nas suas regras | Automático (a plataforma decide) |

---

### Cenário Prático (Simulado)

Você tem um e-commerce que roda em um **App Service Plan Standard**.
Você configurou uma regra de Autoscale para adicionar 1 instância quando a CPU passar de 85%.
Durante a Black Friday, o tráfego subiu abruptamente. O monitoramento mostrou que o site ficou lento por cerca de 5 a 10 minutos antes de normalizar, mesmo com o Autoscale ligado.

**Por que isso aconteceu e como resolver?**

* **Diagnóstico:** O Autoscale padrão é reativo. Ele espera a média de CPU subir (o que leva tempo), depois manda provisionar a VM (mais tempo de boot/cold start).
* **Solução:** Migrar para um plano **Premium V3** e habilitar o **Automatic Scaling** com instâncias pré-aquecidas (pre-warmed instances). Assim, a capacidade extra já estaria pronta esperando o pico.

Ficou clara a diferença entre o "Regrado" (Standard) e o "Elástico" (Premium)? Quer ver como isso se aplica a Containers dentro do App Service?