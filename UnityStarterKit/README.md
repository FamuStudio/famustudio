# Urban Run: Wasteland Escape — Unity Starter Kit

Starter kit autónomo do **MVP jogável** de um endless runner mobile, criado com C# e primitivas 3D temporárias. A pasta não altera a aplicação web que já existe na raiz do repositório.

## Requisitos

- Unity **2022.3 LTS** ou posterior compatível.
- Sem pacotes externos obrigatórios.
- Usa o Input Manager clássico para teclado, rato e toque.
- Para Android, instalar o módulo Android Build Support (SDK/NDK e OpenJDK) pelo Unity Hub.

## Abrir e executar

1. No Unity Hub, escolha **Add project from disk** e seleccione `UnityStarterKit/`.
2. Abra o projecto e crie uma cena vazia: **File → New Scene → Basic (Built-in)** (ou equivalente).
3. Guarde-a como `Assets/Scenes/UrbanRun.unity`.
4. Em **Edit → Project Settings → Player → Other Settings**, defina **Active Input Handling** como `Input Manager (Old)` ou `Both` e aceite o reinício do Editor se pedido.
5. Carregue em **Play**. O `GameBootstrapper` cria automaticamente a pista, jogador, Warden, object pools e HUD; não é necessário colocar componentes manualmente.
6. Carregue em **INICIAR CORRIDA**.

No Editor, use setas ou `A/D` para mudar de faixa, `W`/`↑`/`Space` para saltar, `S`/`↓`/`Left Shift` para deslizar e duplo clique para activar o equipamento. Em telemóvel, deslize para os lados, para cima/baixo; toque duas vezes para equipamento. Os botões no ecrã iniciam, pausam/retomam ou reiniciam a corrida.

## Sistemas incluídos

| Sistema | Implementação |
| --- | --- |
| Bootstrap de protótipo | Cena vazia transforma-se numa pista jogável em runtime; arte placeholder com primitivas. |
| Jogador | Três faixas, movimento interpolado, swipe/teclado, salto, gravidade e slide com collider reduzido. |
| Geração da pista | Módulos de estrada reciclados, obstáculos em padrões de quatro linhas e pickups. |
| Fairness | `PatternValidator` pesquisa faixas alcançáveis, rejeita padrões sem rota e limita o tempo de reacção; inclui autotestes de padrões válidos/impossíveis e de reacção curta. |
| Performance | `ObjectPool` reutiliza módulos, obstáculos e collectibles; velocidade aumenta gradualmente. |
| Obstáculos | Bloqueio, barreira de salto e obstáculo elevado para slide; esquivas bem executadas contam como near miss. |
| Recursos | Water azul e Fuel laranja; totais e recorde persistem em `PlayerPrefs`. |
| Equipamento | Magnet (8 s), Nitro (4 s) e Shield; pickups dão cargas e o equipamento pode ser activado por duplo toque ou HUD. |
| Perseguição | Warden aproxima-se visualmente quando o medidor cai; colisões reduzem o medidor e três colisões terminam a corrida. |
| HUD | Menu, pontuação, distância, multiplicador, recursos, Escape Meter, pausa, resultados e reinício. |

## Estrutura do código

```text
Assets/UrbanRun/Scripts/
├── Bootstrap/GameBootstrapper.cs
├── Core/GameManager.cs, GameState.cs, SaveManager.cs
├── Player/PlayerController.cs
├── World/ObjectPool.cs, PatternValidator.cs, TrackSpawner.cs, WorldMover.cs
├── Obstacles/Obstacle.cs
├── Collectibles/Collectible.cs
├── Systems/EquipmentSystem.cs
├── Enemy/WardenController.cs
└── UI/HUDController.cs
```

### Fluxo da corrida

`GameBootstrapper` cria e liga os sistemas. `GameManager` detém estado/score/velocidade; `TrackSpawner` consulta padrões pré-definidos validados antes de os activar; `WorldMover` desloca objectos e devolve-os ao pool. `PlayerController` processa input e movimento; os gatilhos de `Obstacle` e `Collectible` actualizam a corrida. `WardenController` mantém o Escape Meter e `SaveManager` grava recorde e inventário local.

## Testes manuais recomendados

1. Confirmar que o arranque regista **PatternValidator self-tests** sem erros na Console.
2. Trocar repetidamente de faixa: a faixa deve limitar-se a 0–2 e a transição deve ser suave.
3. Saltar uma barreira amarela e deslizar sob uma viga laranja; estas acções devem evitar dano e creditar near miss.
4. Colidir com um bloco cinzento: o escudo inicial absorve uma colisão; colisões subsequentes aproximam o Warden; três colisões terminam a corrida.
5. Recolher Water/Fuel e equipamentos, activar o equipamento, pausar/retomar, terminar e reiniciar.
6. Verificar no menu de resultados a pontuação e a persistência do recorde após reabrir o Editor.
7. Em Android, validar em dispositivo físico o tamanho dos alvos, safe area, 60/30 FPS e temperatura/consumo.

## Configuração e extensões

- Largura de faixa: `PlayerController.LaneWidth`.
- Velocidade inicial/máxima, curva, pontuação e penalizações: `GameManager`.
- Distância de geração e intervalo: `TrackSpawner`.
- Padrões e reacção mínima: `PatternValidator`.
- Duração/efeitos/cargas: `EquipmentSystem`.
- A persistência actual é local, via `PlayerPrefs`; não sincroniza entre dispositivos.

## Fora do âmbito desta base

Este starter kit **não** inclui modelos/animações finais, áudio, Addressables, missões, upgrades/economia completa, selecção de personagens, leaderboard, eventos, analytics, monetização, backend/sincronização ou pipeline de publicação. Também não inclui um APK/IPA. Os assets 3D são placeholders procedurais e o projecto tem de ser aberto e testado no Unity Editor antes de qualquer release.
