let gameSpeed = 1; // Define a velocidade inicial do jogo.

// Define objetos de cor para várias cores.
const BLUE = { r: 0x67, g: 0xd7, b: 0xf0 };
const GREEN = { r: 0xa6, g: 0xe0, b: 0x2c };
const PINK = { r: 0xfa, g: 0x24, b: 0x73 };
const ORANGE = { r: 0xfe, g: 0x95, b: 0x22 };
const allColors = [BLUE, GREEN, PINK, ORANGE]; // Armazena essas cores em um array.

// Define uma função para calcular o atraso de spawn para elementos do jogo.
const getSpawnDelay = () => {
  const spawnDelayMax = 1400;
  const spawnDelayMin = 550;
  const spawnDelay = spawnDelayMax - state.game.cubeCount * 3.1; // Ajusta o atraso de spawn com base no estado do jogo.
  return Math.max(spawnDelay, spawnDelayMin); // Garante que o atraso de spawn não seja inferior a um valor mínimo.
};
const doubleStrongEnableScore = 2000; // Define um limite de pontuação para habilitar uma função do jogo.

const slowmoThreshold = 10;
const strongThreshold = 25;
const spinnerThreshold = 25;

let pointerIsDown = false; // Acompanha se o ponteiro do mouse/touch está atualmente pressionado.

let pointerScreen = { x: 0, y: 0 }; // Armazena as coordenadas de tela do ponteiro.

let pointerScene = { x: 0, y: 0 }; // Armazena as coordenadas da cena do jogo do ponteiro.

const minPointerSpeed = 60; // Define uma velocidade mínima do ponteiro para interações.

const hitDampening = 0.1; // Um valor que afeta o amortecimento de interações de "hit".

const backboardZ = -400; // Define a coordenada Z da placa traseira.

const shadowColor = "#262e36"; // Cor usada para sombras no jogo.

const airDrag = 0.022; // Define o coeficiente de arrasto do ar.

const gravity = 0.3; // Define a força da gravidade no jogo.

// Várias constantes relacionadas a efeitos visuais no jogo.
const sparkColor = "rgba(170,221,255,.9)";
const sparkThickness = 2.2;
const airDragSpark = 0.1;
const touchTrailColor = "rgba(170,221,255,.62)";
const touchTrailThickness = 7;
const touchPointLife = 120;
const touchPoints = [];

const targetRadius = 40; // Define o raio de um alvo no jogo.
const targetHitRadius = 50; // Define o raio de acerto de um alvo.
const makeTargetGlueColor = (target) => {
  return "rgb(170,221,255)";
}; // Gera uma cor para "colar" alvos.

const fragRadius = targetRadius / 3; // Define o raio de fragmentos quando um alvo é atingido.

const canvas = document.querySelector("#c"); // Seleciona um elemento HTML canvas para renderização.

const cameraDistance = 900; // Define a distância da câmera para a cena do jogo.

const sceneScale = 1; // Define a escala da cena do jogo.

const cameraFadeStartZ = 0.45 * cameraDistance; // Define o início do desvanecimento da câmera.
const cameraFadeEndZ = 0.65 * cameraDistance; // Define o fim do desvanecimento da câmera.
const cameraFadeRange = cameraFadeEndZ - cameraFadeStartZ; // Define a faixa de desvanecimento da câmera.

// Arrays para armazenar elementos e polígonos do jogo.
const allVertices = [];
const allPolys = [];
const allShadowVertices = [];
const allShadowPolys = [];

// Símbolos para modos de jogo e menus.
const GAME_MODE_RANKED = Symbol("GAME_MODE_RANKED");
const GAME_MODE_CASUAL = Symbol("GAME_MODE_CASUAL");
const MENU_MAIN = Symbol("MENU_MAIN");
const MENU_PAUSE = Symbol("MENU_PAUSE");
const MENU_SCORE = Symbol("MENU_SCORE");

// Objeto de estado contendo informações sobre o jogo e menus.
const state = {
  game: {
    mode: GAME_MODE_RANKED,
    time: 0,
    score: 0,
    cubeCount: 0,
  },
  menus: {
    active: MENU_MAIN,
  },
};

// Funções para verificar o estado do jogo e o modo.
const isInGame = () => !state.menus.active;
const isMenuVisible = () => !!state.menus.active;
const isCasualGame = () => state.game.mode === GAME_MODE_CASUAL;
const isPaused = () => state.menus.active === MENU_PAUSE;

// Funções para obter e definir a pontuação mais alta no armazenamento local.
const highScoreKey = "__menja__highScore";
const getHighScore = () => {
  const raw = localStorage.getItem(highScoreKey);
  return raw ? parseInt(raw, 10) : 0;
};
let _lastHighscore = getHighScore();
const setHighScore = (score) => {
  _lastHighscore = getHighScore();
  localStorage.setItem(highScoreKey, String(score));
};

// Função para verificar se a pontuação atual é uma nova pontuação mais alta.
const isNewHighScore = () => state.game.score > _lastHighscore;

// Função auxiliar para verificar condições e lançar erros se as condições não forem atendidas.
const invariant = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Função auxiliar para selecionar elementos DOM e adicionar manipuladores de eventos de clique.
const $ = (selector) => document.querySelector(selector);
const handleClick = (element, handler) =>
  element.addEventListener("click", handler);
const handlePointerDown = (element, handler) => {
  element.addEventListener("touchstart", handler);
  element.addEventListener("mousedown", handler);
};

// Função auxiliar para formatar números com vírgulas como separadores de milhares.
const formatNumber = (num) => num.toLocaleString();

// Constantes para valores matemáticos.
const PI = Math.PI;
const TAU = Math.PI * 2;
const ETA = Math.PI * 0.5;

// Funções auxiliares para operações matemáticas comuns.
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const lerp = (a, b, mix) => (b - a) * mix + a;
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => ((Math.random() * (max - min + 1)) | 0) + min;
const pickOne = (arr) => arr[(Math.random() * arr.length) | 0];

// Funções para converter objetos de cor em strings hexadecimais e sombrear cores.
const colorToHex = (color) => {
  return (
    "#" +
    (color.r | 0).toString(16).padStart(2, "0") +
    (color.g | 0).toString(16).padStart(2, "0") +
    (color.b | 0).toString(16).padStart(2, "0")
  );
};
const shadeColor = (color, lightness) => {
  let other, mix;
  if (lightness < 0.5) {
    other = 0;
    mix = 1 - lightness * 2;
  } else {
    other = 255;
    mix = lightness * 2 - 1;
  }
  return (
    "#" +
    (lerp(color.r, other, mix) | 0).toString(16).padStart(2, "0") +
    (lerp(color.g, other, mix) | 0).toString(16).padStart(2, "0") +
    (lerp(color.b, other, mix) | 0).toString(16).padStart(2, "0")
  );
};

// 2 parte

// Array para armazenar todos os cooldowns
const _allCooldowns = [];

// Função para criar um cooldown
const makeCooldown = (rechargeTime, units = 1) => {
  let timeRemaining = 0;
  let lastTime = 0;

  const initialOptions = { rechargeTime, units };

  // Função para atualizar o tempo
  const updateTime = () => {
    const now = state.game.time;

    if (now < lastTime) {
      timeRemaining = 0;
    } else {
      timeRemaining -= now - lastTime;
      if (timeRemaining < 0) timeRemaining = 0;
    }
    lastTime = now;
  };

  // Função para verificar se pode usar
  const canUse = () => {
    updateTime();
    return timeRemaining <= rechargeTime * (units - 1);
  };

  // Objeto cooldown
  const cooldown = {
    canUse,
    useIfAble() {
      const usable = canUse();
      if (usable) timeRemaining += rechargeTime;
      return usable;
    },
    mutate(options) {
      if (options.rechargeTime) {
        timeRemaining -= rechargeTime - options.rechargeTime;
        if (timeRemaining < 0) timeRemaining = 0;
        rechargeTime = options.rechargeTime;
      }
      if (options.units) units = options.units;
    },
    reset() {
      timeRemaining = 0;
      lastTime = 0;
      this.mutate(initialOptions);
    },
  };

  // Adiciona o cooldown ao array de todos os cooldowns
  _allCooldowns.push(cooldown);

  return cooldown;
};

// Função para resetar todos os cooldowns
const resetAllCooldowns = () =>
  _allCooldowns.forEach((cooldown) => cooldown.reset());

// Função para criar um spawner
const makeSpawner = ({ chance, cooldownPerSpawn, maxSpawns }) => {
  const cooldown = makeCooldown(cooldownPerSpawn, maxSpawns);
  return {
    shouldSpawn() {
      return Math.random() <= chance && cooldown.useIfAble();
    },
    mutate(options) {
      if (options.chance) chance = options.chance;
      cooldown.mutate({
        rechargeTime: options.cooldownPerSpawn,
        units: options.maxSpawns,
      });
    },
  };
};

// Função para normalizar um vetor
const normalize = (v) => {
  const mag = Math.hypot(v.x, v.y, v.z);
  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag,
  };
};

// Função para adicionar um número a outro
const add = (a) => (b) => a + b;

// Função para escalar um vetor
const scaleVector = (scale) => (vector) => {
  vector.x *= scale;
  vector.y *= scale;
  vector.z *= scale;
};

// Função para clonar vértices
function cloneVertices(vertices) {
  return vertices.map((v) => ({ x: v.x, y: v.y, z: v.z }));
}

// Função para copiar vértices para outro array
function copyVerticesTo(arr1, arr2) {
  const len = arr1.length;
  for (let i = 0; i < len; i++) {
    const v1 = arr1[i];
    const v2 = arr2[i];
    v2.x = v1.x;
    v2.y = v1.y;
    v2.z = v1.z;
  }
}

// Função para calcular o ponto médio de um triângulo
function computeTriMiddle(poly) {
  const v = poly.vertices;
  poly.middle.x = (v[0].x + v[1].x + v[2].x) / 3;
  poly.middle.y = (v[0].y + v[1].y + v[2].y) / 3;
  poly.middle.z = (v[0].z + v[1].z + v[2].z) / 3;
}

// Função para calcular o ponto médio de um quadrilátero
function computeQuadMiddle(poly) {
  const v = poly.vertices;
  poly.middle.x = (v[0].x + v[1].x + v[2].x + v[3].x) / 4;
  poly.middle.y = (v[0].y + v[1].y + v[2].y + v[3].y) / 4;
  poly.middle.z = (v[0].z + v[1].z + v[2].z + v[3].z) / 4;
}

// Função para calcular o ponto médio de um polígono
function computePolyMiddle(poly) {
  if (poly.vertices.length === 3) {
    computeTriMiddle(poly);
  } else {
    computeQuadMiddle(poly);
  }
}

// Função para calcular a profundidade de um polígono
function computePolyDepth(poly) {
  computePolyMiddle(poly);
  const dX = poly.middle.x;
  const dY = poly.middle.y;
  const dZ = poly.middle.z - cameraDistance;
  poly.depth = Math.hypot(dX, dY, dZ);
}

// 3 parte

// Função para calcular a normal de um polígono
function computePolyNormal(poly, normalName) {
  const v1 = poly.vertices[0];
  const v2 = poly.vertices[1];
  const v3 = poly.vertices[2];

  // Cálculo do vetor normal usando o produto vetorial
  const ax = v1.x - v2.x;
  const ay = v1.y - v2.y;
  const az = v1.z - v2.z;
  const bx = v1.x - v3.x;
  const by = v1.y - v3.y;
  const bz = v1.z - v3.z;

  const nx = ay * bz - az * by;
  const ny = az * bx - ax * bz;
  const nz = ax * by - ay * bx;

  // Normalização do vetor normal
  const mag = Math.hypot(nx, ny, nz);
  const polyNormal = poly[normalName];
  polyNormal.x = nx / mag;
  polyNormal.y = ny / mag;
  polyNormal.z = nz / mag;
}

// Função para transformar vértices
function transformVertices(
  vertices,
  target,
  tX,
  tY,
  tZ,
  rX,
  rY,
  rZ,
  sX,
  sY,
  sZ
) {
  // Cálculo dos senos e cossenos para as rotações
  const sinX = Math.sin(rX);
  const cosX = Math.cos(rX);
  const sinY = Math.sin(rY);
  const cosY = Math.cos(rY);
  const sinZ = Math.sin(rZ);
  const cosZ = Math.cos(rZ);

  // Transformação dos vértices
  vertices.forEach((v, i) => {
    const targetVertex = target[i];

    // Rotação em torno do eixo X
    const x1 = v.x;
    const y1 = v.z * sinX + v.y * cosX;
    const z1 = v.z * cosX - v.y * sinX;

    // Rotação em torno do eixo Y
    const x2 = x1 * cosY - z1 * sinY;
    const y2 = y1;
    const z2 = x1 * sinY + z1 * cosY;

    // Rotação em torno do eixo Z
    const x3 = x2 * cosZ - y2 * sinZ;
    const y3 = x2 * sinZ + y2 * cosZ;
    const z3 = z2;

    // Aplicação da translação e escala
    targetVertex.x = x3 * sX + tX;
    targetVertex.y = y3 * sY + tY;
    targetVertex.z = z3 * sZ + tZ;
  });
}

// Função para projetar um vértice
const projectVertex = (v) => {
  const focalLength = cameraDistance * sceneScale;
  const depth = focalLength / (cameraDistance - v.z);
  v.x = v.x * depth;
  v.y = v.y * depth;
};

// Função para projetar um vértice em um alvo
const projectVertexTo = (v, target) => {
  const focalLength = cameraDistance * sceneScale;
  const depth = focalLength / (cameraDistance - v.z);
  target.x = v.x * depth;
  target.y = v.y * depth;
};

// Funções vazias para medição de desempenho
const PERF_START = () => {};
const PERF_END = () => {};
const PERF_UPDATE = () => {};

// Função para criar um modelo de cubo
function makeCubeModel({ scale = 1 }) {
  return {
    vertices: [
      { x: -scale, y: -scale, z: scale },
      { x: scale, y: -scale, z: scale },
      { x: scale, y: scale, z: scale },
      { x: -scale, y: scale, z: scale },

      { x: -scale, y: -scale, z: -scale },
      { x: scale, y: -scale, z: -scale },
      { x: scale, y: scale, z: -scale },
      { x: -scale, y: scale, z: -scale },
    ],
    polys: [
      { vIndexes: [0, 1, 2, 3] },

      { vIndexes: [7, 6, 5, 4] },

      { vIndexes: [3, 2, 6, 7] },

      { vIndexes: [4, 5, 1, 0] },

      { vIndexes: [5, 6, 2, 1] },

      { vIndexes: [0, 3, 7, 4] },
    ],
  };
}

// Função para criar um modelo de cubo recursivo
function makeRecursiveCubeModel({ recursionLevel, splitFn, color, scale = 1 }) {
  const getScaleAtLevel = (level) => 1 / 3 ** level;

  let cubeOrigins = [{ x: 0, y: 0, z: 0 }];

  // Criação dos cubos em cada nível de recursão
  for (let i = 1; i <= recursionLevel; i++) {
    const scale = getScaleAtLevel(i) * 2;
    const cubeOrigins2 = [];
    cubeOrigins.forEach((origin) => {
      cubeOrigins2.push(...splitFn(origin, scale));
    });
    cubeOrigins = cubeOrigins2;
  }

  const finalModel = { vertices: [], polys: [] };

  const cubeModel = makeCubeModel({ scale: 1 });
  cubeModel.vertices.forEach(scaleVector(getScaleAtLevel(recursionLevel)));

  const maxComponent =
    getScaleAtLevel(recursionLevel) * (3 ** recursionLevel - 1);

  cubeOrigins.forEach((origin, cubeIndex) => {
    const occlusion =
      Math.max(Math.abs(origin.x), Math.abs(origin.y), Math.abs(origin.z)) /
      maxComponent;

    const occlusionLighter =
      recursionLevel > 2 ? occlusion : (occlusion + 0.8) / 1.8;

    finalModel.vertices.push(
      ...cubeModel.vertices.map((v) => ({
        x: (v.x + origin.x) * scale,
        y: (v.y + origin.y) * scale,
        z: (v.z + origin.z) * scale,
      }))
    );

    finalModel.polys.push(
      ...cubeModel.polys.map((poly) => ({
        vIndexes: poly.vIndexes.map(add(cubeIndex * 8)),
      }))
    );
  });

  return finalModel;
}

// 4 parte

// Função para dividir uma esponja de Menger
function mengerSpongeSplit(o, s) {
  // Retorna um array de objetos representando as coordenadas dos novos cubos
  return [
    { x: o.x + s, y: o.y - s, z: o.z + s },
    { x: o.x + s, y: o.y - s, z: o.z + 0 },
    { x: o.x + s, y: o.y - s, z: o.z - s },
    { x: o.x + 0, y: o.y - s, z: o.z + s },
    { x: o.x + 0, y: o.y - s, z: o.z - s },
    { x: o.x - s, y: o.y - s, z: o.z + s },
    { x: o.x - s, y: o.y - s, z: o.z + 0 },
    { x: o.x - s, y: o.y - s, z: o.z - s },

    { x: o.x + s, y: o.y + s, z: o.z + s },
    { x: o.x + s, y: o.y + s, z: o.z + 0 },
    { x: o.x + s, y: o.y + s, z: o.z - s },
    { x: o.x + 0, y: o.y + s, z: o.z + s },
    { x: o.x + 0, y: o.y + s, z: o.z - s },
    { x: o.x - s, y: o.y + s, z: o.z + s },
    { x: o.x - s, y: o.y + s, z: o.z + 0 },
    { x: o.x - s, y: o.y + s, z: o.z - s },

    { x: o.x + s, y: o.y + 0, z: o.z + s },
    { x: o.x + s, y: o.y + 0, z: o.z - s },
    { x: o.x - s, y: o.y + 0, z: o.z + s },
    { x: o.x - s, y: o.y + 0, z: o.z - s },
  ];
}

// Função para otimizar um modelo
function optimizeModel(model, threshold = 0.0001) {
  const { vertices, polys } = model;

  // Função para comparar vértices
  const compareVertices = (v1, v2) =>
    Math.abs(v1.x - v2.x) < threshold &&
    Math.abs(v1.y - v2.y) < threshold &&
    Math.abs(v1.z - v2.z) < threshold;

  // Função para comparar polígonos
  const comparePolys = (p1, p2) => {
    const v1 = p1.vIndexes;
    const v2 = p2.vIndexes;
    return (
      (v1[0] === v2[0] ||
        v1[0] === v2[1] ||
        v1[0] === v2[2] ||
        v1[0] === v2[3]) &&
      (v1[1] === v2[0] ||
        v1[1] === v2[1] ||
        v1[1] === v2[2] ||
        v1[1] === v2[3]) &&
      (v1[2] === v2[0] ||
        v1[2] === v2[1] ||
        v1[2] === v2[2] ||
        v1[2] === v2[3]) &&
      (v1[3] === v2[0] || v1[3] === v2[1] || v1[3] === v2[2] || v1[3] === v2[3])
    );
  };

  // Adiciona um array de índices originais a cada vértice
  vertices.forEach((v, i) => {
    v.originalIndexes = [i];
  });

  // Remove vértices duplicados
  for (let i = vertices.length - 1; i >= 0; i--) {
    for (let ii = i - 1; ii >= 0; ii--) {
      const v1 = vertices[i];
      const v2 = vertices[ii];
      if (compareVertices(v1, v2)) {
        vertices.splice(i, 1);
        v2.originalIndexes.push(...v1.originalIndexes);
        break;
      }
    }
  }

  // Atualiza os índices dos vértices nos polígonos
  vertices.forEach((v, i) => {
    polys.forEach((p) => {
      p.vIndexes.forEach((vi, ii, arr) => {
        const vo = v.originalIndexes;
        if (vo.includes(vi)) {
          arr[ii] = i;
        }
      });
    });
  });

  // Adiciona uma soma dos índices dos vértices a cada polígono e ordena os polígonos por essa soma
  polys.forEach((p) => {
    const vi = p.vIndexes;
    p.sum = vi[0] + vi[1] + vi[2] + vi[3];
  });
  polys.sort((a, b) => b.sum - a.sum);

  // Remove polígonos duplicados
  for (let i = polys.length - 1; i >= 0; i--) {
    for (let ii = i - 1; ii >= 0; ii--) {
      const p1 = polys[i];
      const p2 = polys[ii];
      if (p1.sum !== p2.sum) break;
      if (comparePolys(p1, p2)) {
        polys.splice(i, 1);
        polys.splice(ii, 1);
        i--;
        break;
      }
    }
  }

  return model;
}


// 5 parte

// Classe para representar uma entidade
class Entity {
  constructor({ model, color, wireframe = false }) {
    // Clonando os vértices do modelo
    const vertices = cloneVertices(model.vertices);
    const shadowVertices = cloneVertices(model.vertices);
    const colorHex = colorToHex(color);
    const darkColorHex = shadeColor(color, 0.4);

    // Criando polígonos
    const polys = model.polys.map((p) => ({
      vertices: p.vIndexes.map((vIndex) => vertices[vIndex]),
      color: color,
      wireframe: wireframe,
      strokeWidth: wireframe ? 2 : 0,
      strokeColor: colorHex,
      strokeColorDark: darkColorHex,
      depth: 0,
      middle: { x: 0, y: 0, z: 0 },
      normalWorld: { x: 0, y: 0, z: 0 },
      normalCamera: { x: 0, y: 0, z: 0 },
    }));

    // Criando polígonos de sombra
    const shadowPolys = model.polys.map((p) => ({
      vertices: p.vIndexes.map((vIndex) => shadowVertices[vIndex]),
      wireframe: wireframe,
      normalWorld: { x: 0, y: 0, z: 0 },
    }));

    // Inicializando propriedades da entidade
    this.projected = {};
    this.model = model;
    this.vertices = vertices;
    this.polys = polys;
    this.shadowVertices = shadowVertices;
    this.shadowPolys = shadowPolys;
    this.reset();
  }

  // Método para resetar a entidade
  reset() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xD = 0;
    this.yD = 0;
    this.zD = 0;

    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.rotateXD = 0;
    this.rotateYD = 0;
    this.rotateZD = 0;

    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;

    this.projected.x = 0;
    this.projected.y = 0;
  }

  // Método para transformar a entidade
  transform() {
    transformVertices(
      this.model.vertices,
      this.vertices,
      this.x,
      this.y,
      this.z,
      this.rotateX,
      this.rotateY,
      this.rotateZ,
      this.scaleX,
      this.scaleY,
      this.scaleZ
    );

    copyVerticesTo(this.vertices, this.shadowVertices);
  }

  // Método para projetar a entidade
  project() {
    projectVertexTo(this, this.projected);
  }
}

// Array para armazenar os alvos
const targets = [];

// Mapa para armazenar os alvos por cor
const targetPool = new Map(allColors.map((c) => [c, []]));
const targetWireframePool = new Map(allColors.map((c) => [c, []]));

// Função para obter um alvo
const getTarget = (() => {
  const slowmoSpawner = makeSpawner({
    chance: 0.5,
    cooldownPerSpawn: 10000,
    maxSpawns: 1,
  });

  let doubleStrong = false;
  const strongSpawner = makeSpawner({
    chance: 0.3,
    cooldownPerSpawn: 12000,
    maxSpawns: 1,
  });

  const spinnerSpawner = makeSpawner({
    chance: 0.1,
    cooldownPerSpawn: 10000,
    maxSpawns: 1,
  });

  const axisOptions = [
    ["x", "y"],
    ["y", "z"],
    ["z", "x"],
  ];

  // Função para obter um alvo de um estilo específico
  function getTargetOfStyle(color, wireframe) {
    const pool = wireframe ? targetWireframePool : targetPool;
    let target = pool.get(color).pop();
    if (!target) {
      target = new Entity({
        model: optimizeModel(
          makeRecursiveCubeModel({
            recursionLevel: 1,
            splitFn: mengerSpongeSplit,
            scale: targetRadius,
          })
        ),
        color: color,
        wireframe: wireframe,
      });

      target.color = color;
      target.wireframe = wireframe;

      target.hit = false;
      target.maxHealth = 0;
      target.health = 0;
    }
    return target;
  }

// 5 parte

 // Função para obter um alvo com base no estado do jogo
return function getTarget() {
  // Verifica se a pontuação do jogo atingiu o limite para ativar ou desativar o "doubleStrong"
  if (doubleStrong && state.game.score <= doubleStrongEnableScore) {
    doubleStrong = false;
  } else if (!doubleStrong && state.game.score > doubleStrongEnableScore) {
    doubleStrong = true;
    strongSpawner.mutate({ maxSpawns: 2 });
  }

  // Define as propriedades iniciais do alvo
  let color = pickOne([BLUE, GREEN, ORANGE]);
  let wireframe = false;
  let health = 1;
  let maxHealth = 3;

  // Verifica se o número de cubos atingiu o limite para ativar o "spinner"
  const spinner =
    state.game.cubeCount >= spinnerThreshold &&
    isInGame() &&
    spinnerSpawner.shouldSpawn();

  // Verifica se o número de cubos atingiu o limite para ativar o "slowmo"
  if (
    state.game.cubeCount >= slowmoThreshold &&
    slowmoSpawner.shouldSpawn()
  ) {
    color = BLUE;
    wireframe = true;
  } 
  // Verifica se o número de cubos atingiu o limite para ativar o "strong"
  else if (
    state.game.cubeCount >= strongThreshold &&
    strongSpawner.shouldSpawn()
  ) {
    color = PINK;
    health = 3;
  } 

  // 6 parte
    const target = getTargetOfStyle(color, wireframe);
    target.hit = false;
    target.maxHealth = maxHealth;
    target.health = health;
    updateTargetHealth(target, 0);

    const spinSpeeds = [Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05];

    if (spinner) {
      spinSpeeds[0] = -0.25;
      spinSpeeds[1] = 0;
      target.rotateZ = random(0, TAU);
    }

    const axes = pickOne(axisOptions);

    spinSpeeds.forEach((spinSpeed, i) => {
      switch (axes[i]) {
        case "x":
          target.rotateXD = spinSpeed;
          break;
        case "y":
          target.rotateYD = spinSpeed;
          break;
        case "z":
          target.rotateZD = spinSpeed;
          break;
      }
    });

    return target;
  };
})();

const updateTargetHealth = (target, healthDelta) => {
  target.health += healthDelta;

  if (!target.wireframe) {
    const strokeWidth = target.health - 1;
    const strokeColor = makeTargetGlueColor(target);
    for (let p of target.polys) {
      p.strokeWidth = strokeWidth;
      p.strokeColor = strokeColor;
    }
  }
};

const returnTarget = (target) => {
  target.reset();
  const pool = target.wireframe ? targetWireframePool : targetPool;
  pool.get(target.color).push(target);
};

function resetAllTargets() {
  while (targets.length) {
    returnTarget(targets.pop());
  }
}

const frags = [];

const fragPool = new Map(allColors.map((c) => [c, []]));
const fragWireframePool = new Map(allColors.map((c) => [c, []]));

const createBurst = (() => {
  const basePositions = mengerSpongeSplit({ x: 0, y: 0, z: 0 }, fragRadius * 2);
  const positions = cloneVertices(basePositions);
  const prevPositions = cloneVertices(basePositions);
  const velocities = cloneVertices(basePositions);

  const basePositionNormals = basePositions.map(normalize);
  const positionNormals = cloneVertices(basePositionNormals);

  const fragCount = basePositions.length;

  function getFragForTarget(target) {
    const pool = target.wireframe ? fragWireframePool : fragPool;
    let frag = pool.get(target.color).pop();
    if (!frag) {
      frag = new Entity({
        model: makeCubeModel({ scale: fragRadius }),
        color: target.color,
        wireframe: target.wireframe,
      });
      frag.color = target.color;
      frag.wireframe = target.wireframe;
    }
    return frag;
  }

  return (target, force = 1) => {
    transformVertices(
      basePositions,
      positions,
      target.x,
      target.y,
      target.z,
      target.rotateX,
      target.rotateY,
      target.rotateZ,
      1,
      1,
      1
    );
    transformVertices(
      basePositions,
      prevPositions,
      target.x - target.xD,
      target.y - target.yD,
      target.z - target.zD,
      target.rotateX - target.rotateXD,
      target.rotateY - target.rotateYD,
      target.rotateZ - target.rotateZD,
      1,
      1,
      1
    );

// 7 parte

    for (let i = 0; i < fragCount; i++) {
      const position = positions[i];
      const prevPosition = prevPositions[i];
      const velocity = velocities[i];

      velocity.x = position.x - prevPosition.x;
      velocity.y = position.y - prevPosition.y;
      velocity.z = position.z - prevPosition.z;
    }

    transformVertices(
      basePositionNormals,
      positionNormals,
      0,
      0,
      0,
      target.rotateX,
      target.rotateY,
      target.rotateZ,
      1,
      1,
      1
    );

    for (let i = 0; i < fragCount; i++) {
      const position = positions[i];
      const velocity = velocities[i];
      const normal = positionNormals[i];

      const frag = getFragForTarget(target);

      frag.x = position.x;
      frag.y = position.y;
      frag.z = position.z;
      frag.rotateX = target.rotateX;
      frag.rotateY = target.rotateY;
      frag.rotateZ = target.rotateZ;

      const burstSpeed = 2 * force;
      const randSpeed = 2 * force;
      const rotateScale = 0.015;
      frag.xD = velocity.x + normal.x * burstSpeed + Math.random() * randSpeed;
      frag.yD = velocity.y + normal.y * burstSpeed + Math.random() * randSpeed;
      frag.zD = velocity.z + normal.z * burstSpeed + Math.random() * randSpeed;
      frag.rotateXD = frag.xD * rotateScale;
      frag.rotateYD = frag.yD * rotateScale;
      frag.rotateZD = frag.zD * rotateScale;

      frags.push(frag);
    }
  };
})();

const returnFrag = (frag) => {
  frag.reset();
  const pool = frag.wireframe ? fragWireframePool : fragPool;
  pool.get(frag.color).push(frag);
};

const sparks = [];
const sparkPool = [];

function addSpark(x, y, xD, yD) {
  const spark = sparkPool.pop() || {};

  spark.x = x + xD * 0.5;
  spark.y = y + yD * 0.5;
  spark.xD = xD;
  spark.yD = yD;
  spark.life = random(200, 300);
  spark.maxLife = spark.life;

  sparks.push(spark);

  return spark;
}

function sparkBurst(x, y, count, maxSpeed) {
  const angleInc = TAU / count;
  for (let i = 0; i < count; i++) {
    const angle = i * angleInc + angleInc * Math.random();
    const speed = (1 - Math.random() ** 3) * maxSpeed;
    addSpark(x, y, Math.sin(angle) * speed, Math.cos(angle) * speed);
  }
}

let glueShedVertices;
function glueShedSparks(target) {
  if (!glueShedVertices) {
    glueShedVertices = cloneVertices(target.vertices);
  } else {
    copyVerticesTo(target.vertices, glueShedVertices);
  }

  glueShedVertices.forEach((v) => {
    if (Math.random() < 0.4) {
      projectVertex(v);
      addSpark(v.x, v.y, random(-12, 12), random(-12, 12));
    }
  });
}

function returnSpark(spark) {
  sparkPool.push(spark);
}

const hudContainerNode = $(".hud");

function setHudVisibility(visible) {
  if (visible) {
    hudContainerNode.style.display = "block";
  } else {
    hudContainerNode.style.display = "none";
  }
}

const scoreNode = $(".score-lbl");
const cubeCountNode = $(".cube-count-lbl");

function renderScoreHud() {
  if (isCasualGame()) {
    scoreNode.style.display = "none";
    cubeCountNode.style.opacity = 1;
  } else {
    scoreNode.innerText = `PONTOS: ${state.game.score}`;
    scoreNode.style.display = "block";
    cubeCountNode.style.opacity = 0.65;
  }
  cubeCountNode.innerText = `CUBOS CORTADOS: ${state.game.cubeCount}`;
}

renderScoreHud();

handlePointerDown($(".pause-btn"), () => pauseGame());

const slowmoNode = $(".slowmo");
const slowmoBarNode = $(".slowmo__bar");

function renderSlowmoStatus(percentRemaining) {
  slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;
  slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}

const menuContainerNode = $(".menus");
const menuMainNode = $(".menu--main");
const menuPauseNode = $(".menu--pause");
const menuScoreNode = $(".menu--score");

const finalScoreLblNode = $(".final-score-lbl");
const highScoreLblNode = $(".high-score-lbl");

function showMenu(node) {
  node.classList.add("active");
}

function hideMenu(node) {
  node.classList.remove("active");
}

function renderMenus() {
  hideMenu(menuMainNode);
  hideMenu(menuPauseNode);
  hideMenu(menuScoreNode);

  switch (state.menus.active) {
    case MENU_MAIN:
      showMenu(menuMainNode);
      break;
    case MENU_PAUSE:
      showMenu(menuPauseNode);
      break;
    case MENU_SCORE:
      finalScoreLblNode.textContent = formatNumber(state.game.score);
      if (isNewHighScore()) {
        highScoreLblNode.textContent = "Nova Pontuação!";
      } else {
        highScoreLblNode.textContent = `Maior Pontuação: ${formatNumber(
          getHighScore()
        )}`;
      }
      showMenu(menuScoreNode);
      break;
  }

  setHudVisibility(!isMenuVisible());
  menuContainerNode.classList.toggle("has-active", isMenuVisible());
  menuContainerNode.classList.toggle(
    "interactive-mode",
    isMenuVisible() && pointerIsDown
  );
}

renderMenus();

handleClick($(".play-normal-btn"), () => {
  setGameMode(GAME_MODE_RANKED);
  setActiveMenu(null);
  resetGame();
});

handleClick($(".play-casual-btn"), () => {
  setGameMode(GAME_MODE_CASUAL);
  setActiveMenu(null);
  resetGame();
});

handleClick($(".resume-btn"), () => resumeGame());
handleClick($(".menu-btn--pause"), () => setActiveMenu(MENU_MAIN));

handleClick($(".play-again-btn"), () => {
  setActiveMenu(null);
  resetGame();
});

handleClick($(".menu-btn--score"), () => setActiveMenu(MENU_MAIN));

handleClick($(".play-normal-btn"), () => {
  setGameMode(GAME_MODE_RANKED);
  setActiveMenu(null);
  resetGame();
});

handleClick($(".play-casual-btn"), () => {
  setGameMode(GAME_MODE_CASUAL);
  setActiveMenu(null);
  resetGame();
});

handleClick($(".resume-btn"), () => resumeGame());
handleClick($(".menu-btn--pause"), () => setActiveMenu(MENU_MAIN));

handleClick($(".play-again-btn"), () => {
  setActiveMenu(null);
  resetGame();
});

handleClick($(".menu-btn--score"), () => setActiveMenu(MENU_MAIN));

function setActiveMenu(menu) {
  state.menus.active = menu;
  renderMenus();
}

function setScore(score) {
  state.game.score = score;
  renderScoreHud();
}

function incrementScore(inc) {
  if (isInGame()) {
    state.game.score += inc;
    if (state.game.score < 0) {
      state.game.score = 0;
    }
    renderScoreHud();
  }
}

function setCubeCount(count) {
  state.game.cubeCount = count;
  renderScoreHud();
}

function incrementCubeCount(inc) {
  if (isInGame()) {
    state.game.cubeCount += inc;
    renderScoreHud();
  }
}

function setGameMode(mode) {
  state.game.mode = mode;
}

function resetGame() {
  resetAllTargets();
  state.game.time = 0;
  resetAllCooldowns();
  setScore(0);
  setCubeCount(0);
  spawnTime = getSpawnDelay();
}

function pauseGame() {
  isInGame() && setActiveMenu(MENU_PAUSE);
}

function resumeGame() {
  isPaused() && setActiveMenu(null);
}

function endGame() {
  handleCanvasPointerUp();
  if (isNewHighScore()) {
    setHighScore(state.game.score);
  }
  setActiveMenu(MENU_SCORE);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "p") {
    isPaused() ? resumeGame() : pauseGame();
  }
});

let spawnTime = 0;
const maxSpawnX = 450;
const pointerDelta = { x: 0, y: 0 };
const pointerDeltaScaled = { x: 0, y: 0 };

const slowmoDuration = 1500;
let slowmoRemaining = 0;
let spawnExtra = 0;
const spawnExtraDelay = 300;
let targetSpeed = 1;

function tick(width, height, simTime, simSpeed, lag) {
  PERF_START("frame");
  PERF_START("tick");

  state.game.time += simTime;

  if (slowmoRemaining > 0) {
    slowmoRemaining -= simTime;
    if (slowmoRemaining < 0) {
      slowmoRemaining = 0;
    }
    targetSpeed = pointerIsDown ? 0.075 : 0.3;
  } else {
    const menuPointerDown = isMenuVisible() && pointerIsDown;
    targetSpeed = menuPointerDown ? 0.025 : 1;
  }

  renderSlowmoStatus(slowmoRemaining / slowmoDuration);

  gameSpeed += ((targetSpeed - gameSpeed) / 22) * lag;
  gameSpeed = clamp(gameSpeed, 0, 1);

  const centerX = width / 2;
  const centerY = height / 2;

  const simAirDrag = 1 - airDrag * simSpeed;
  const simAirDragSpark = 1 - airDragSpark * simSpeed;

  const forceMultiplier = 1 / (simSpeed * 0.75 + 0.25);
  pointerDelta.x = 0;
  pointerDelta.y = 0;
  pointerDeltaScaled.x = 0;
  pointerDeltaScaled.y = 0;
  const lastPointer = touchPoints[touchPoints.length - 1];

  if (pointerIsDown && lastPointer && !lastPointer.touchBreak) {
    pointerDelta.x = pointerScene.x - lastPointer.x;
    pointerDelta.y = pointerScene.y - lastPointer.y;
    pointerDeltaScaled.x = pointerDelta.x * forceMultiplier;
    pointerDeltaScaled.y = pointerDelta.y * forceMultiplier;
  }
  const pointerSpeed = Math.hypot(pointerDelta.x, pointerDelta.y);
  const pointerSpeedScaled = pointerSpeed * forceMultiplier;

  touchPoints.forEach((p) => (p.life -= simTime));

  if (pointerIsDown) {
    touchPoints.push({
      x: pointerScene.x,
      y: pointerScene.y,
      life: touchPointLife,
    });
  }

  while (touchPoints[0] && touchPoints[0].life <= 0) {
    touchPoints.shift();
  }

  PERF_START("entities");

  spawnTime -= simTime;
  if (spawnTime <= 0) {
    if (spawnExtra > 0) {
      spawnExtra--;
      spawnTime = spawnExtraDelay;
    } else {
      spawnTime = getSpawnDelay();
    }
    const target = getTarget();
    const spawnRadius = Math.min(centerX * 0.8, maxSpawnX);
    target.x = Math.random() * spawnRadius * 2 - spawnRadius;
    target.y = centerY + targetHitRadius * 2;
    target.z = Math.random() * targetRadius * 2 - targetRadius;
    target.xD = Math.random() * ((target.x * -2) / 120);
    target.yD = -20;
    targets.push(target);
  }

  const leftBound = -centerX + targetRadius;
  const rightBound = centerX - targetRadius;
  const ceiling = -centerY - 120;
  const boundDamping = 0.4;

  targetLoop: for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];
    target.x += target.xD * simSpeed;
    target.y += target.yD * simSpeed;

    if (target.y < ceiling) {
      target.y = ceiling;
      target.yD = 0;
    }

    if (target.x < leftBound) {
      target.x = leftBound;
      target.xD *= -boundDamping;
    } else if (target.x > rightBound) {
      target.x = rightBound;
      target.xD *= -boundDamping;
    }

    if (target.z < backboardZ) {
      target.z = backboardZ;
      target.zD *= -boundDamping;
    }

    target.yD += gravity * simSpeed;
    target.rotateX += target.rotateXD * simSpeed;
    target.rotateY += target.rotateYD * simSpeed;
    target.rotateZ += target.rotateZD * simSpeed;
    target.transform();
    target.project();

    if (target.y > centerY + targetHitRadius * 2) {
      targets.splice(i, 1);
      returnTarget(target);
      if (isInGame()) {
        if (isCasualGame()) {
          incrementScore(-25);
        } else {
          endGame();
        }
      }
      continue;
    }

    const hitTestCount = Math.ceil((pointerSpeed / targetRadius) * 2);

    for (let ii = 1; ii <= hitTestCount; ii++) {
      const percent = 1 - ii / hitTestCount;
      const hitX = pointerScene.x - pointerDelta.x * percent;
      const hitY = pointerScene.y - pointerDelta.y * percent;
      const distance = Math.hypot(
        hitX - target.projected.x,
        hitY - target.projected.y
      );

      if (distance <= targetHitRadius) {
        if (!target.hit) {
          target.hit = true;

          target.xD += pointerDeltaScaled.x * hitDampening;
          target.yD += pointerDeltaScaled.y * hitDampening;
          target.rotateXD += pointerDeltaScaled.y * 0.001;
          target.rotateYD += pointerDeltaScaled.x * 0.001;

          const sparkSpeed = 7 + pointerSpeedScaled * 0.125;

          if (pointerSpeedScaled > minPointerSpeed) {
            target.health--;
            incrementScore(10);

            if (target.health <= 0) {
              incrementCubeCount(1);
              createBurst(target, forceMultiplier);
              sparkBurst(hitX, hitY, 8, sparkSpeed);
              if (target.wireframe) {
                slowmoRemaining = slowmoDuration;
                spawnTime = 0;
                spawnExtra = 2;
              }
              targets.splice(i, 1);
              returnTarget(target);
            } else {
              sparkBurst(hitX, hitY, 8, sparkSpeed);
              glueShedSparks(target);
              updateTargetHealth(target, 0);
            }
          } else {
            incrementScore(5);
            sparkBurst(hitX, hitY, 3, sparkSpeed);
          }
        }

        continue targetLoop;
      }
    }

    target.hit = false;
  }

  const fragBackboardZ = backboardZ + fragRadius;

  const fragLeftBound = -width;
  const fragRightBound = width;

  for (let i = frags.length - 1; i >= 0; i--) {
    const frag = frags[i];
    frag.x += frag.xD * simSpeed;
    frag.y += frag.yD * simSpeed;
    frag.z += frag.zD * simSpeed;

    frag.xD *= simAirDrag;
    frag.yD *= simAirDrag;
    frag.zD *= simAirDrag;

    if (frag.y < ceiling) {
      frag.y = ceiling;
      frag.yD = 0;
    }

    if (frag.z < fragBackboardZ) {
      frag.z = fragBackboardZ;
      frag.zD *= -boundDamping;
    }

    frag.yD += gravity * simSpeed;
    frag.rotateX += frag.rotateXD * simSpeed;
    frag.rotateY += frag.rotateYD * simSpeed;
    frag.rotateZ += frag.rotateZD * simSpeed;
    frag.transform();
    frag.project();

    if (
      frag.projected.y > centerY + targetHitRadius ||
      frag.projected.x < fragLeftBound ||
      frag.projected.x > fragRightBound ||
      frag.z > cameraFadeEndZ
    ) {
      frags.splice(i, 1);
      returnFrag(frag);
      continue;
    }
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];
    spark.life -= simTime;
    if (spark.life <= 0) {
      sparks.splice(i, 1);
      returnSpark(spark);
      continue;
    }
    spark.x += spark.xD * simSpeed;
    spark.y += spark.yD * simSpeed;
    spark.xD *= simAirDragSpark;
    spark.yD *= simAirDragSpark;
    spark.yD += gravity * simSpeed;
  }

  PERF_END("entities");

  PERF_START("3D");

  allVertices.length = 0;
  allPolys.length = 0;
  allShadowVertices.length = 0;
  allShadowPolys.length = 0;
  targets.forEach((entity) => {
    allVertices.push(...entity.vertices);
    allPolys.push(...entity.polys);
    allShadowVertices.push(...entity.shadowVertices);
    allShadowPolys.push(...entity.shadowPolys);
  });

  frags.forEach((entity) => {
    allVertices.push(...entity.vertices);
    allPolys.push(...entity.polys);
    allShadowVertices.push(...entity.shadowVertices);
    allShadowPolys.push(...entity.shadowPolys);
  });

  allPolys.forEach((p) => computePolyNormal(p, "normalWorld"));
  allPolys.forEach(computePolyDepth);
  allPolys.sort((a, b) => b.depth - a.depth);

  allVertices.forEach(projectVertex);

  allPolys.forEach((p) => computePolyNormal(p, "normalCamera"));

  PERF_END("3D");

  PERF_START("shadows");

  transformVertices(
    allShadowVertices,
    allShadowVertices,
    0,
    0,
    0,
    TAU / 8,
    0,
    0,
    1,
    1,
    1
  );

  allShadowPolys.forEach((p) => computePolyNormal(p, "normalWorld"));

  const shadowDistanceMult = Math.hypot(1, 1);
  const shadowVerticesLength = allShadowVertices.length;
  for (let i = 0; i < shadowVerticesLength; i++) {
    const distance = allVertices[i].z - backboardZ;
    allShadowVertices[i].z -= shadowDistanceMult * distance;
  }
  transformVertices(
    allShadowVertices,
    allShadowVertices,
    0,
    0,
    0,
    -TAU / 8,
    0,
    0,
    1,
    1,
    1
  );
  allShadowVertices.forEach(projectVertex);

  PERF_END("shadows");

  PERF_END("tick");
}

function draw(ctx, width, height, viewScale) {
  PERF_START("draw");

  const halfW = width / 2;
  const halfH = height / 2;

  ctx.lineJoin = "bevel";

  PERF_START("drawShadows");
  ctx.fillStyle = shadowColor;
  ctx.strokeStyle = shadowColor;
  allShadowPolys.forEach((p) => {
    if (p.wireframe) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      const { vertices } = p;
      const vCount = vertices.length;
      const firstV = vertices[0];
      ctx.moveTo(firstV.x, firstV.y);
      for (let i = 1; i < vCount; i++) {
        const v = vertices[i];
        ctx.lineTo(v.x, v.y);
      }
      ctx.closePath();
      ctx.stroke();
    } else {
      ctx.beginPath();
      const { vertices } = p;
      const vCount = vertices.length;
      const firstV = vertices[0];
      ctx.moveTo(firstV.x, firstV.y);
      for (let i = 1; i < vCount; i++) {
        const v = vertices[i];
        ctx.lineTo(v.x, v.y);
      }
      ctx.closePath();
      ctx.fill();
    }
  });
  PERF_END("drawShadows");

  PERF_START("drawPolys");

  allPolys.forEach((p) => {
    if (!p.wireframe && p.normalCamera.z < 0) return;

    if (p.strokeWidth !== 0) {
      ctx.lineWidth =
        p.normalCamera.z < 0 ? p.strokeWidth * 0.5 : p.strokeWidth;
      ctx.strokeStyle =
        p.normalCamera.z < 0 ? p.strokeColorDark : p.strokeColor;
    }

    const { vertices } = p;
    const lastV = vertices[vertices.length - 1];
    const fadeOut = p.middle.z > cameraFadeStartZ;

    if (!p.wireframe) {
      const normalLight = p.normalWorld.y * 0.5 + p.normalWorld.z * -0.5;
      const lightness =
        normalLight > 0
          ? 0.1
          : ((normalLight ** 32 - normalLight) / 2) * 0.9 + 0.1;
      ctx.fillStyle = shadeColor(p.color, lightness);
    }

    if (fadeOut) {
      ctx.globalAlpha = Math.max(
        0,
        1 - (p.middle.z - cameraFadeStartZ) / cameraFadeRange
      );
    }

    ctx.beginPath();
    ctx.moveTo(lastV.x, lastV.y);
    for (let v of vertices) {
      ctx.lineTo(v.x, v.y);
    }

    if (!p.wireframe) {
      ctx.fill();
    }
    if (p.strokeWidth !== 0) {
      ctx.stroke();
    }

    if (fadeOut) {
      ctx.globalAlpha = 1;
    }
  });
  PERF_END("drawPolys");

  PERF_START("draw2D");

  ctx.strokeStyle = sparkColor;
  ctx.lineWidth = sparkThickness;
  ctx.beginPath();
  sparks.forEach((spark) => {
    ctx.moveTo(spark.x, spark.y);

    const scale = (spark.life / spark.maxLife) ** 0.5 * 1.5;
    ctx.lineTo(spark.x - spark.xD * scale, spark.y - spark.yD * scale);
  });
  ctx.stroke();

  ctx.strokeStyle = touchTrailColor;
  const touchPointCount = touchPoints.length;
  for (let i = 1; i < touchPointCount; i++) {
    const current = touchPoints[i];
    const prev = touchPoints[i - 1];
    if (current.touchBreak || prev.touchBreak) {
      continue;
    }
    const scale = current.life / touchPointLife;
    ctx.lineWidth = scale * touchTrailThickness;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }

  PERF_END("draw2D");

  PERF_END("draw");
  PERF_END("frame");

  PERF_UPDATE();
}

function setupCanvases() {
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;

  let viewScale;

  let width, height;

  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    viewScale = h / 1000;
    width = w / viewScale;
    height = h / viewScale;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }

  handleResize();

  window.addEventListener("resize", handleResize);

  let lastTimestamp = 0;
  function frameHandler(timestamp) {
    let frameTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    raf();

    if (isPaused()) return;

    if (frameTime < 0) {
      frameTime = 17;
    } else if (frameTime > 68) {
      frameTime = 68;
    }

    const halfW = width / 2;
    const halfH = height / 2;

    pointerScene.x = pointerScreen.x / viewScale - halfW;
    pointerScene.y = pointerScreen.y / viewScale - halfH;

    const lag = frameTime / 16.6667;
    const simTime = gameSpeed * frameTime;
    const simSpeed = gameSpeed * lag;
    tick(width, height, simTime, simSpeed, lag);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawScale = dpr * viewScale;
    ctx.scale(drawScale, drawScale);
    ctx.translate(halfW, halfH);
    draw(ctx, width, height, viewScale);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const raf = () => requestAnimationFrame(frameHandler);

  raf();
}

function handleCanvasPointerDown(x, y) {
  if (!pointerIsDown) {
    pointerIsDown = true;
    pointerScreen.x = x;
    pointerScreen.y = y;

    if (isMenuVisible()) renderMenus();
  }
}

function handleCanvasPointerUp() {
  if (pointerIsDown) {
    pointerIsDown = false;
    touchPoints.push({
      touchBreak: true,
      life: touchPointLife,
    });

    if (isMenuVisible()) renderMenus();
  }
}

// Função para lidar com o movimento do ponteiro no canvas
function handleCanvasPointerMove(x, y) {
  if (pointerIsDown) {
    // Atualiza a posição do ponteiro na tela
    pointerScreen.x = x;
    pointerScreen.y = y;
  }
}

// Verifica se os eventos PointerEvent são suportados pelo navegador
if ("PointerEvent" in window) {
  // Configura os ouvintes de eventos PointerEvent
  canvas.addEventListener("pointerdown", (event) => {
    // Verifica se o evento é do botão primário do mouse e, em seguida, chama a função de tratamento
    event.isPrimary && handleCanvasPointerDown(event.clientX, event.clientY);
  });

  canvas.addEventListener("pointerup", (event) => {
    // Verifica se o evento é do botão primário do mouse e, em seguida, chama a função de tratamento
    event.isPrimary && handleCanvasPointerUp();
  });

  canvas.addEventListener("pointermove", (event) => {
    // Verifica se o evento é do botão primário do mouse e, em seguida, chama a função de tratamento
    event.isPrimary && handleCanvasPointerMove(event.clientX, event.clientY);
  });

  // Ouve o evento quando o mouse sai do corpo do documento para tratar o evento de soltar o ponteiro
  document.body.addEventListener("mouseleave", handleCanvasPointerUp);
} else {
  let activeTouchId = null;

  // Configura os ouvintes de eventos de toque para dispositivos que não suportam PointerEvent
  canvas.addEventListener("touchstart", (event) => {
    if (!pointerIsDown) {
      // Obtém o primeiro toque no evento e armazena seu identificador
      const touch = event.changedTouches[0];
      activeTouchId = touch.identifier;
      // Chama a função de tratamento de pressionar o ponteiro
      handleCanvasPointerDown(touch.clientX, touch.clientY);
    }
  });

  canvas.addEventListener("touchend", (event) => {
    for (let touch of event.changedTouches) {
      if (touch.identifier === activeTouchId) {
        // Encontra o toque ativo pelo identificador e chama a função de tratamento de soltar o ponteiro
        handleCanvasPointerUp();
        break;
      }
    }
  });

  canvas.addEventListener(
    "touchmove",
    (event) => {
      for (let touch of event.changedTouches) {
        if (touch.identifier === activeTouchId) {
          // Encontra o toque ativo pelo identificador e chama a função de tratamento de movimento do ponteiro
          handleCanvasPointerMove(touch.clientX, touch.clientY);
          event.preventDefault(); // Previne o comportamento padrão de rolagem da tela
          break;
        }
      }
    },
    { passive: false }
  );
}

// Configura os canvas
setupCanvases();

