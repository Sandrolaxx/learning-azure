## Conhecendo o Copilot

O objetivo desse lab é realizar testes no VS Code utilizando a ferramenta do Copilot para aprimorar desempenho no desenvolvimento.

### Como instalar?

Basta buscar pela extensão do Copilot na barra de pesquisa de extensão e realizar o login com a conta do GitHub, nesse momento já teremos acesso a versão free.

Abaixo um exemplo da busca.

![Image](https://github.com/user-attachments/assets/12c9677e-e2f2-42fa-902b-a045edae6fac)

### Plano free?

O Microsoft Copilot, em suas diversas versões, oferece funcionalidades de inteligência artificial para auxiliar usuários em diversas tarefas, desde a geração de código até a criação de documentos e a análise de dados. No entanto, o "Copilot Free" (ou a versão gratuita do Copilot) possui algumas limitações importantes em comparação com as versões pagas, como o Copilot Pro.

Aqui estão as principais limitações e recursos do Copilot Free:

* **Uso Pessoal Apenas:** O Copilot Free é destinado a uso pessoal e não é adequado para usuários gerenciados por uma organização ou empresa. Ele não inclui recursos como gerenciamento de acesso, logs de auditoria, gerenciamento de política, exclusão de arquivo, dados de uso ou cobertura de indenização, que são cruciais para ambientes corporativos.
* **Limites de Preenchimentos de Código e Solicitações de Chat:**
    * **Preenchimentos de código em IDEs:** Geralmente, o Copilot Free oferece até 2 mil preenchimentos de código por mês.
    * **Solicitações de chat:** O limite é de cerca de 50 solicitações de chat por mês.
    * **Prioridade de Modelo:** Em horários de pico, o Copilot Free pode ser limitado ao uso do modelo GPT-3.5, enquanto versões pagas têm acesso prioritário ao GPT-4 e outros modelos mais avançados, como o GPT-4 Turbo.
* **Ausência de Integração Completa com Aplicativos Microsoft 365 (Office):** A versão gratuita do Copilot geralmente **não oferece a integração completa** de IA diretamente em aplicativos como Word, Excel, PowerPoint, Outlook e OneNote para uso pessoal. Essa funcionalidade é um dos principais diferenciais do Copilot Pro.
* **Limitações de Documentos para Análise:** Ao fornecer documentos para o Copilot analisar, há limites de tamanho para um melhor desempenho.
    * Perguntas sobre o documento: funciona melhor se o documento tiver menos de 7.500 palavras.
    * Reescrita: funciona melhor em documentos com menos de 3.000 palavras.
    * Se o documento for maior, o Copilot pode se concentrar apenas na primeira parte.
* **Cota de Mensagens de IA Generativa (Copilot Studio/Power Platform):** Em ambientes específicos como o Copilot Studio (para criação de chatbots), existem cotas de mensagens que, uma vez atingidas, fazem com que o usuário veja um aviso de falha.
* **Geração de Imagens (Microsoft Designer):** No Copilot gratuito, você geralmente tem 15 "boosts" (créditos) por dia para criar imagens. Após isso, a criação pode ser mais lenta.
* **Dados de Treinamento de IA:** O Copilot não é treinado com dados de:
    * Clientes comerciais ou usuários conectados a uma conta organizacional do M365/EntraID.
    * Usuários conectados com assinaturas do M365 Personal ou Family.
    * Usuários que não estão conectados ao Copilot usando uma conta Microsoft ou outra autenticação de terceiros.
    * Usuários autenticados menores de 18 anos.
    * Usuários que optaram por não participar do treinamento.
    * Usuários em alguns países como Brasil, China (exceto Hong Kong), Israel, Nigéria, Coreia do Sul e Vietnã (onde nenhum dado do usuário é utilizado para treinamento de modelos de IA generativa até novo aviso).

#### Recursos do Copilot Free:

Apesar das limitações, o Copilot Free oferece funcionalidades bastante úteis para usuários individuais:

* **Preenchimentos de Código, Edições e Chat (GitHub Copilot Free no Visual Studio):** Para desenvolvedores, o Copilot Free permite experimentar a assistência de codificação alimentada por IA no Visual Studio, incluindo:
    * **Copilot Completions:** Sugestões de código em tempo real.
    * **Edições:** Auxílio na edição de código.
    * **Chat:** Interação com a IA para obter explicações, refatorar código, etc.
* **Acesso a Modelos de Linguagem:** Oferece acesso aos modelos de linguagem GPT-4 e GPT-4 Turbo (fora dos horários de pico), e GPT-3.5 por padrão em momentos de tráfego intenso.
* **Funções de Voz (Voice) e Raciocínio (Think Deeper):** A Microsoft anunciou a liberação dessas funcionalidades para usuários gratuitos e ilimitados.
    * **Voice:** Permite conversar com o Copilot naturalmente, usando comandos de voz.
    * **Think Deeper:** Usa modelos avançados (como o modelo o1 da OpenAI) para fornecer respostas mais profundas e precisas, resolver problemas complexos e auxiliar em tarefas que exigem raciocínio.
* **Geração de Imagens (Microsoft Designer/Bing Image Creator):** Permite criar imagens sem custos usando os "boosts" diários.
* **Integração com Plataformas da Microsoft:** O Copilot Free pode ser acessado em diversas plataformas e aplicativos da Microsoft, como:
    * Windows
    * Android
    * iOS
    * Web (através de `copilot.microsoft.com`)
    * Navegador Edge
    * Paint (alguns recursos)
* **Recursos Gerais de Chat e Assistência de IA:**
    * Pesquisar na web usando comandos de voz ou texto.
    * Obter respostas rápidas para perguntas.
    * Criar lembretes, listas de tarefas ou notas.
    * Traduzir textos.
    * Gerar rascunhos de conteúdo (para e-mails, documentos, etc.) e resumos.
    * Planejamento de tarefas.
    * Acesso a plug-ins que aumentam a experiência da plataforma.
    * Uso de outros GPTs (chatbots personalizados e dedicados).
* **Gratuito para Estudantes, Professores e Mantenedores de Projetos Open Source:** Desenvolvedores que se qualificam através do GitHub Education ou como mantenedores de repositórios populares de código aberto podem obter acesso gratuito ao GitHub Copilot, que geralmente oferece mais funcionalidades do que a versão básica "free" para o público em geral.

---

### Testando modelo Cloud Sonnet 3.5

Dado o prompt:
```
@workspace /new vamos criar uma roleta de jogo de roleta com a velocidade mantendo a rotação e uma bolinha batendo no meio seguindo as leis da física no planeta terra, podemos utilizar html, css, javascript, canva no html para criar as formas e animação
```

Vamos ver o resultado nos principais modelos("Claude Sonnet", "GPT-4" e "o3-mini").

#### Claude

Resultado do prompt:

![Image](https://github.com/user-attachments/assets/00b431a7-3796-4358-ab0d-fa2f0e667650)

Para chegar no resultado acima também foi utilizado mais um prompt no "Copilot Edits" para corrigir bugs.

#### o3-mini

Resultado do prompt:

![Image](https://github.com/user-attachments/assets/a8507ab4-b80f-44fe-a1ea-64105b5ed595)

O estilo ficou próximo do prompt, porém ele fica infinitamente girando a roleta.

---

### Criando API consome via-cep com Gemini 2.0 Flash

Neste exemplo criamos o prompt:
```
@workspace /new crie uma API em node que consome a API viacep e disponibilizar um end-point para consulta de cep em /v1/{cep}, ela deve ser uma API de simples consumo, com validação para o CEP informado, deve respeitar o padrão atual. Crie tambem os testes unitários da funcionalidade.
```

Ele criou o projeto dividindo em pastas de maneira organizada, porém o código não funcionava por conta de erros na modularização, após 8 interações no Copilot Edits foi possível corrigir o código e os testes unitários, minha experiência com ele foi relativamente frustrante, nesses testes simples a Claude pareceu ser o modelo mais maduro para essas tarefas de pair-programming.

![Image](https://github.com/user-attachments/assets/aa0be395-a234-4394-800c-aac5e23bddf8)

