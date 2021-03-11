enum GameObjectType {
  Tree = 0,
  StoneMine,
  GoldMine = 3,
  Spike,
  GreaterSpike,
  PoisonSpike,
  SpinningSpike,
  WoodWall,
  StoneWall,
  CastleWall,
  Sapling,
  Mine = 2,
  Bush = 1,
  Cactus
}

let gameObjectSizes: Partial<Record<GameObjectType, number[]>> = { };
gameObjectSizes[GameObjectType.Tree] = [50, 60, 65, 75];
gameObjectSizes[GameObjectType.Bush] = gameObjectSizes[GameObjectType.Mine] = [50, 60];
gameObjectSizes[GameObjectType.GoldMine] = [60];

gameObjectSizes = Object.freeze(gameObjectSizes);

export { gameObjectSizes, GameObjectType };
