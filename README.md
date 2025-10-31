# Relógio Digital • Cronômetro • Temporizador

Um projeto completo desenvolvido em **HTML**, **CSS** e **JavaScript puro**, que combina três funcionalidades em uma interface moderna e responsiva:

- 🕒 **Relógio Digital**  
- ⏱️ **Cronômetro (Stopwatch)**  
- ⏲️ **Temporizador (Timer)**  

O objetivo é demonstrar manipulação de tempo, DOM e animações com `requestAnimationFrame`, além de boas práticas em JavaScript.

---

## Demonstração

> 💡 Abra o arquivo `index.html` no navegador e explore os três modos.  
> Totalmente funcional **offline**, sem dependências externas.

---

## Funcionalidades

### Relógio Digital
- Mostra a **hora e data atuais** sincronizadas com o sistema.  
- Atualização automática a cada segundo.  
- Suporte a **tema claro e escuro**.

### Cronômetro
- Inicie, pause, resete e registre **laps (voltas)**.  
- Alta precisão usando `performance.now()`.  
- Armazenamento dinâmico das voltas na tela.

### Temporizador
- Defina **horas, minutos e segundos**.  
- Controle de **Start / Pause / Reset**.  
- Alerta sonoro ao término do tempo.  
- Pode ser pausado e retomado a qualquer momento.

---

### Tecnologias utilizadas

| Tecnologia | Função |
|-------------|--------|
| **HTML5** | Estrutura da aplicação |
| **CSS3 (Grid e Flexbox)** | Layout responsivo e estilização moderna |
| **JavaScript (ES6+)** | Lógica dos modos e controle de tempo |
| **Web Audio API** | Geração do som de alerta no temporizador |
| **ARIA Roles / Acessibilidade** | Melhor experiência para leitores de tela |

---

### Estrutura do Projeto

- relogio-cronometro-temporizador
├── index.html # Página principal com todo o código
└── README.md # Documentação do projeto


> Caso queira separar os arquivos:
> - `styles.css` → estilos  
> - `script.js` → lógicas JS  

---

### Conceitos Aplicados

- Manipulação do DOM em tempo real  
- Intervalos com `setInterval()`  
- Uso de `requestAnimationFrame()` para animações precisas  
- Formatação de tempo (`padStart`)  
- Criação de alertas sonoros com `AudioContext`  
- Design responsivo e acessível  
- Alternância entre modos de exibição com `data-*`  

---

### Como executar

1. Faça o clone do repositório:
   ```bash
   git clone https://github.com/seuusuario/relogio-cronometro-temporizador.git

2. Acesse a pasta:

    `cd relogio-cronometro-temporizador`

3. Abra o arquivo index.html no navegador:

    `start index.html`

(ou arraste o arquivo diretamente para o navegador)

---

### Personalizações sugeridas

Alterar cores e fontes no CSS

Adicionar modo escuro automático (baseado no sistema)

Salvar últimas medições com localStorage

Exportar laps do cronômetro para CSV

Criar uma versão com React ou Vue.js

---

### Atalhos do Teclado

|Tecla|Função                 |
|-|---------------------------|
|1|	Alternar para Relógio     |
|2|	Alternar para Cronômetro  |
|3|	Alternar para Temporizador|

---

### Licença

Este projeto é de código aberto e pode ser utilizado livremente para fins educacionais e pessoais.
Créditos: Desenvolvido por Vagner Oliveira

📷 Prévia (sugestão)

Interface moderna com três modos integrados e tema claro/escuro.

