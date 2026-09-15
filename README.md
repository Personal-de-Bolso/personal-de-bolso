# Personal de Bolso — V1

Primeiro protótipo do Personal de Bolso.

## O que esta V1 já faz
- Tela inicial
- Cadastro rápido do usuário
- Conversa inicial com o Personal IA (fluxo local demonstrativo)
- Perguntas para definir objetivo, frequência, duração, prioridade, local e exercícios evitados
- Geração de uma primeira estrutura de treino
- Interface responsiva para celular

## Como publicar
Este projeto é estático: basta colocar os arquivos em um repositório GitHub e ativar **GitHub Pages** em Settings → Pages → Deploy from branch → `main` / root.

## Próxima etapa
A próxima V1.1 deve trocar a geração demonstrativa por um motor real de treino e criar o modo de execução:
- exercício atual
- séries
- repetições
- carga
- timer de descanso
- conclusão da série
- próximo exercício
- XP
- missões semanais
- persistência dos dados

### Importante sobre IA
Não coloque uma chave de API de IA diretamente no JavaScript público do GitHub Pages. Quando formos integrar IA real, vamos criar um backend/serverless seguro para intermediar as chamadas.
