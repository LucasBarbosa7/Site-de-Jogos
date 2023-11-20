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

const sceneScale = 1.5; // Define a escala da cena do jogo.

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

// Array para armazenar todos os cooldowns (tempo de espera)
const _allCooldowns = [];

// Função para criar um cooldown (tempo de espera)
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

  // Objeto cooldown (termpo de espera)
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

// Essas funções estão relacionadas ao cálculo do ponto médio de polígonos no espaço tridimensional.
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

// Função para dividir (cortar), os cubos
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

    // Obtém o alvo (objeto) com base nas configurações de cor e contorno (wireframe)
    const target = getTargetOfStyle(color, wireframe);

    // Inicializa as propriedades do alvo
    target.hit = false; // Define a propriedade 'hit' como false, indicando que o alvo não foi atingido ainda.
    target.maxHealth = maxHealth; // Define a quantidade máxima de saúde que o alvo pode ter.
    target.health = health; // Define a quantidade atual de saúde do alvo.

    // Atualiza a exibição da saúde do alvo (representação visual)
    updateTargetHealth(target, 0);

    // Cria um array chamado 'spinSpeeds'
    const spinSpeeds = [Math.random() * 0.1 - 0.05, Math.random() * 0.1 - 0.05];

    // Verifica se a variável 'spinner' é verdadeira
    if (spinner) {
      // Define a velocidade de rotação no eixo x como -0.25
      spinSpeeds[0] = -0.25;

      // Define a velocidade de rotação no eixo y como 0
      spinSpeeds[1] = 0;

      target.rotateZ = random(0, TAU);
    }

    // Seleciona aleatoriamente um conjunto de eixos de rotação a partir das opções disponíveis
    const axes = pickOne(axisOptions);

    // Para cada velocidade de rotação no array spinSpeeds e seu eixo correspondente,
    // aplica a velocidade de rotação ao objeto 'target'
    spinSpeeds.forEach((spinSpeed, i) => {
      // Utiliza um switch para determinar qual eixo de rotação é associado à velocidade
      switch (axes[i]) {
        case "x":
          target.rotateXD = spinSpeed; // Aplica a velocidade de rotação ao eixo x
          break;
        case "y":
          target.rotateYD = spinSpeed; // Aplica a velocidade de rotação ao eixo y
          break;
        case "z":
          target.rotateZD = spinSpeed; // Aplica a velocidade de rotação ao eixo z
          break;
      }
    });

    // Retorna o objeto 'target' após a aplicação das rotações
    return target;
  };
})();

// Atualiza a saúde do objeto 'target' e ajusta a aparência visual dos polígonos se não for um wireframe
const updateTargetHealth = (target, healthDelta) => {
  target.health += healthDelta; // Atualiza a saúde do objeto somando o delta de saúde fornecido

  // Verifica se o objeto não é um wireframe
  if (!target.wireframe) {
    const strokeWidth = target.health - 1; // Calcula a largura da borda com base na saúde
    const strokeColor = makeTargetGlueColor(target); // Obtém a cor da borda usando uma função auxiliar
    // Itera sobre os polígonos no objeto 'target' e atualiza a largura e cor da borda
    for (let p of target.polys) {
      p.strokeWidth = strokeWidth;
      p.strokeColor = strokeColor;
    }
  }
};

// Função que retorna um fragmento (frag) ao pool correspondente e o reinicia
const returnTarget = (target) => {
  target.reset();
  const pool = target.wireframe ? targetWireframePool : targetPool;
  pool.get(target.color).push(target);
};

// Função que reinicia todos os alvos (targets)
function resetAllTargets() {
  // Enquanto houver alvos na lista 'targets', chama a função 'returnTarget' para reiniciar e retornar cada um ao pool
  while (targets.length) {
    returnTarget(targets.pop());
  }
}

// Um array vazio chamado 'frags' para armazenar fragmentos
const frags = [];

// Mapas (pools) para armazenar fragmentos coloridos, separados em pools de wireframe e não wireframe
const fragPool = new Map(allColors.map((c) => [c, []]));
const fragWireframePool = new Map(allColors.map((c) => [c, []]));

// Uma função anônima (IIFE) que cria e retorna uma função chamada 'createBurst'
const createBurst = (() => {
  // Inicialização de variáveis usadas na criação de fragmentos
  const basePositions = mengerSpongeSplit({ x: 0, y: 0, z: 0 }, fragRadius * 2);
  const positions = cloneVertices(basePositions);
  const prevPositions = cloneVertices(basePositions);
  const velocities = cloneVertices(basePositions);

  const basePositionNormals = basePositions.map(normalize);
  const positionNormals = cloneVertices(basePositionNormals);

  const fragCount = basePositions.length;

  // Função interna que obtém um fragmento do pool correspondente ao 'target'
  function getFragForTarget(target) {
    const pool = target.wireframe ? fragWireframePool : fragPool;
    // Obtém um fragmento do pool ou cria um novo se o pool estiver vazio
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

  // Retorna a função 'createBurst', que cria fragmentos com base em um 'target' e uma força opcional
  return (target, force = 1) => {
    // Transforma as posições dos fragmentos com base nas propriedades do 'target'
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
    // Transforma as posições anteriores dos fragmentos com base nas propriedades do 'target' (antes da movimentação)
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

    // Itera sobre todos os fragmentos no array 'frags'
    for (let i = 0; i < fragCount; i++) {
      // Obtém a posição atual, posição anterior e velocidade do fragmento atual
      const position = positions[i];
      const prevPosition = prevPositions[i];
      const velocity = velocities[i];

      // Calcula as componentes da velocidade subtraindo as posições anteriores das atuais
      velocity.x = position.x - prevPosition.x;
      velocity.y = position.y - prevPosition.y;
      velocity.z = position.z - prevPosition.z;
    }

    // Transforma os vetores de posição normalizados baseados na rotação do 'target'
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

    // Loop que itera sobre todos os fragmentos
    for (let i = 0; i < fragCount; i++) {
      // Obtém a posição, velocidade e normal do fragmento atual
      const position = positions[i];
      const velocity = velocities[i];
      const normal = positionNormals[i];

      // Obtém um fragmento do pool correspondente ao 'target' atual
      const frag = getFragForTarget(target);

      // Define as propriedades do fragmento com base nas propriedades do 'target'
      frag.x = position.x;
      frag.y = position.y;
      frag.z = position.z;
      frag.rotateX = target.rotateX;
      frag.rotateY = target.rotateY;
      frag.rotateZ = target.rotateZ;

      // Define as velocidades do fragmento com base nas velocidades do 'target', força e aleatoriedade
      const burstSpeed = 2 * force;
      const randSpeed = 2 * force;
      const rotateScale = 0.015;
      frag.xD = velocity.x + normal.x * burstSpeed + Math.random() * randSpeed;
      frag.yD = velocity.y + normal.y * burstSpeed + Math.random() * randSpeed;
      frag.zD = velocity.z + normal.z * burstSpeed + Math.random() * randSpeed;
      frag.rotateXD = frag.xD * rotateScale;
      frag.rotateYD = frag.yD * rotateScale;
      frag.rotateZD = frag.zD * rotateScale;

      // Adiciona o fragmento ao array 'frags'
      frags.push(frag);
    }
  };
})();

// Função que reinicia um fragmento e o retorna ao pool correspondente
const returnFrag = (frag) => {
  // Reinicia o fragmento
  frag.reset();

  // Determina o pool apropriado com base na propriedade 'wireframe' do fragmento
  const pool = frag.wireframe ? fragWireframePool : fragPool;

  // Adiciona o fragmento de volta ao pool correspondente, agrupado por cor
  pool.get(frag.color).push(frag);
};

// Array para armazenar faíscas atuais
const sparks = [];

// Pool de faíscas
const sparkPool = [];

// Função para adicionar uma faísca com base nas coordenadas e velocidades fornecidas
function addSpark(x, y, xD, yD) {
  // Obtém uma faísca do pool ou cria um novo objeto faísca, se o pool estiver vazio
  const spark = sparkPool.pop() || {};

  // Configura as propriedades da faísca com base nos parâmetros fornecidos
  spark.x = x + xD * 0.5;
  spark.y = y + yD * 0.5;
  spark.xD = xD;
  spark.yD = yD;

  // Define a vida da faísca com um valor aleatório entre 200 e 300
  spark.life = random(200, 300);
  spark.maxLife = spark.life;

  // Adiciona a faísca ao array 'sparks'
  sparks.push(spark);

  // Retorna a faísca recém-criada ou reutilizada
  return spark;
}

// Função para criar uma explosão de faíscas em uma posição específica
function sparkBurst(x, y, count, maxSpeed) {
  // Calcula o incremento angular com base no número de faíscas desejadas
  const angleInc = TAU / count;

  // Loop que itera sobre o número de faíscas desejadas
  for (let i = 0; i < count; i++) {
    // Calcula um ângulo com base no incremento angular e adiciona um componente aleatória para variabilidade
    const angle = i * angleInc + angleInc * Math.random();

    // Calcula uma velocidade aleatória com base na velocidade máxima fornecida
    const speed = (1 - Math.random() ** 3) * maxSpeed;

    // Adiciona uma faísca na posição específica com a velocidade calculada
    addSpark(x, y, Math.sin(angle) * speed, Math.cos(angle) * speed);
  }
}

// Array para armazenar os vértices do objeto 'target' no momento da inicialização
let glueShedVertices;

// Função para gerar faíscas em determinadas posições com base nos vértices do objeto 'target'
function glueShedSparks(target) {
  // Verifica se os vértices ainda não foram inicializados
  if (!glueShedVertices) {
    // Inicializa os vértices com uma cópia dos vértices do objeto 'target'
    glueShedVertices = cloneVertices(target.vertices);
  } else {
    // Atualiza os vértices com uma cópia dos vértices do objeto 'target'
    copyVerticesTo(target.vertices, glueShedVertices);
  }

  // Itera sobre cada vértice dos vértices do objeto 'target'
  glueShedVertices.forEach((v) => {
    // Gera uma faísca com probabilidade de 40% para cada vértice
    if (Math.random() < 0.4) {
      // Projeta o vértice para coordenadas de tela
      projectVertex(v);

      // Adiciona uma faísca na posição do vértice com velocidades aleatórias
      addSpark(v.x, v.y, random(-12, 12), random(-12, 12));
    }
  });
}

// Função para devolver uma faísca ao pool
function returnSpark(spark) {
  // Adiciona a faísca de volta ao pool de faíscas
  sparkPool.push(spark);
}

//Este trecho de código manipula a renderização do HUD de pontuação
// Seleciona o um opção do HUD (menu do jogo) utilizando a função $()
const hudContainerNode = $(".hud");

// Função para definir a visibilidade do HUD
function setHudVisibility(visible) {
  // Verifica se o HUD deve ser exibido ou oculto
  if (visible) {
    // Se visível, define o estilo de exibição do contêiner HUD para "block"
    hudContainerNode.style.display = "block";
  } else {
    // Se oculto, define o estilo de exibição do contêiner HUD para "none"
    hudContainerNode.style.display = "none";
  }
}

// Seleciona a opção do marcador de pontuação usando a função $()
const scoreNode = $(".score-lbl");

// Seleciona a opação do contador de cubos usando a função $()
const cubeCountNode = $(".cube-count-lbl");

// Função para renderizar o HUD de pontuação
function renderScoreHud() {
  // Verifica se o jogo é casual
  if (isCasualGame()) {
    // Se for casual, oculta o nó do marcador de pontuação e ajusta a opacidade do nó do contador de cubos
    scoreNode.style.display = "none";
    cubeCountNode.style.opacity = 1;
  } else {
    // Se não for casual, exibe o marcador de pontuação com o valor atual da pontuação do jogo
    scoreNode.innerText = `PONTOS: ${state.game.score}`;
    scoreNode.style.display = "block";

    // Ajusta a opacidade do nó do contador de cubos
    cubeCountNode.style.opacity = 0.65;
  }

  // Atualiza o texto do nó do contador de cubos com o número atual de cubos cortados no jogo
  cubeCountNode.innerText = `CUBOS CORTADOS: ${state.game.cubeCount}`;
}

// Renderiza o HUD de pontuação
renderScoreHud();

// Adiciona um manipulador de eventos de clique para o botão de pausa, chamando a função pauseGame()
handlePointerDown($(".pause-btn"), () => pauseGame());

// Seleciona os nós relacionados ao status de câmera lenta
const slowmoNode = $(".slowmo");
const slowmoBarNode = $(".slowmo__bar");

// Função para renderizar o status de câmera lenta com base na porcentagem restante
function renderSlowmoStatus(percentRemaining) {
  // Define a opacidade do nó de câmera lenta com base na porcentagem restante
  slowmoNode.style.opacity = percentRemaining === 0 ? 0 : 1;

  // Ajusta a transformação da barra de câmera lenta com base na porcentagem restante
  slowmoBarNode.style.transform = `scaleX(${percentRemaining.toFixed(3)})`;
}

// Seleciona os nós relacionados aos menus
const menuContainerNode = $(".menus");
const menuMainNode = $(".menu--main");
const menuPauseNode = $(".menu--pause");
const menuScoreNode = $(".menu--score");

// Seleciona os nós relacionados aos rótulos de pontuação final e pontuação mais alta
const finalScoreLblNode = $(".final-score-lbl");
const highScoreLblNode = $(".high-score-lbl");

// Função para exibir um menu, adicionando a classe "active"
function showMenu(node) {
  // Adiciona a classe "active", tornando-o visível
  node.classList.add("active");
}

// Função para ocultar um menu, removendo a classe "active"
function hideMenu(node) {
  // Remove a classe "active", tornando-o invisível
  node.classList.remove("active");
}

// Função para renderizar os menus com base no estado atual do jogo
function renderMenus() {
  // Oculta todos os menus inicialmente
  hideMenu(menuMainNode);
  hideMenu(menuPauseNode);
  hideMenu(menuScoreNode);

  // Verifica o tipo de menu ativo no estado e exibe o menu correspondente
  switch (state.menus.active) {
    case MENU_MAIN:
      // Exibe o menu principal
      showMenu(menuMainNode);
      break;
    case MENU_PAUSE:
      // Exibe o menu de pausa
      showMenu(menuPauseNode);
      break;
    case MENU_SCORE:
      // Atualiza os rótulos de pontuação final e pontuação mais alta e exibe o menu de pontuação
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

  // Altera a visibilidade do HUD com base na negação da visibilidade do menu
  setHudVisibility(!isMenuVisible());

  // Adiciona ou remove a classe "has-active" no contêiner do menu com base na visibilidade do menu
  menuContainerNode.classList.toggle("has-active", isMenuVisible());

  // Adiciona ou remove a classe "interactive-mode" no contêiner do menu com base na visibilidade do menu e no estado do ponteiro
  menuContainerNode.classList.toggle(
    "interactive-mode",
    isMenuVisible() && pointerIsDown
  );
}

// Renderiza os menus para exibição inicial
renderMenus();

// Manipuladores de eventos de clique para diferentes elementos HTML
// Botão "Jogar (Normal)" - Configura o modo de jogo, esconde o menu e reinicia o jogo no modo ranqueado
handleClick($(".play-normal-btn"), () => {
  setGameMode(GAME_MODE_RANKED);
  setActiveMenu(null);
  resetGame();
});

// Botão "Jogar (Casual)" - Configura o modo de jogo, esconde o menu e reinicia o jogo no modo casual
handleClick($(".play-casual-btn"), () => {
  setGameMode(GAME_MODE_CASUAL);
  setActiveMenu(null);
  resetGame();
});

// Botão "Continuar" - Resumo do jogo a partir do menu de pausa
handleClick($(".resume-btn"), () => resumeGame());

// Botão de menu de pausa - Retorna ao menu principal
handleClick($(".menu-btn--pause"), () => setActiveMenu(MENU_MAIN));

// Botão "Jogar Novamente" - Esconde o menu e reinicia o jogo
handleClick($(".play-again-btn"), () => {
  setActiveMenu(null);
  resetGame();
});

// Botão do menu de pontuação - Retorna ao menu principal
handleClick($(".menu-btn--score"), () => setActiveMenu(MENU_MAIN));

// Define o menu ativo no estado do jogo e renderiza os menus
function setActiveMenu(menu) {
  // Atualiza o menu ativo no estado do jogo
  state.menus.active = menu;
  // Renderiza os menus para refletir a alteração
  renderMenus();
}

// Define a pontuação no estado do jogo e atualiza o HUD de pontuação
function setScore(score) {
  // Atualiza a pontuação no estado do jogo
  state.game.score = score;
  // Atualiza o HUD de pontuação para refletir a alteração
  renderScoreHud();
}

// Incrementa a pontuação no estado do jogo e atualiza o HUD de pontuação
function incrementScore(inc) {
  // Verifica se o jogo está em andamento antes de incrementar a pontuação
  if (isInGame()) {
    // Incrementa a pontuação no estado do jogo
    state.game.score += inc;
    // Garante que a pontuação não seja negativa
    if (state.game.score < 0) {
      state.game.score = 0;
    }
    // Atualiza o HUD (menu) de pontuação para refletir a alteração
    renderScoreHud();
  }
}

// Define a contagem de cubos no estado do jogo e atualiza o HUD de pontuação
function setCubeCount(count) {
  // Atualiza a contagem de cubos no estado do jogo
  state.game.cubeCount = count;
  // Atualiza o HUD de pontuação para refletir a alteração
  renderScoreHud();
}

// Incrementa a contagem de cubos no estado do jogo e atualiza o HUD de pontuação
function incrementCubeCount(inc) {
  // Verifica se o jogo está em andamento antes de incrementar a contagem de cubos
  if (isInGame()) {
    // Incrementa a contagem de cubos no estado do jogo
    state.game.cubeCount += inc;
    // Atualiza o HUD de pontuação para refletir a alteração
    renderScoreHud();
  }
}

// Define o modo de jogo no estado do jogo
function setGameMode(mode) {
  // Atualiza o modo de jogo no estado do jogo
  state.game.mode = mode;
}

// Reinicia o estado do jogo para começar uma nova partida
function resetGame() {
  // Reinicia todos os alvos no jogo
  resetAllTargets();
  // Reinicia o cronômetro de tempo do jogo
  state.game.time = 0;
  // Reinicia todos os cooldowns do jogo
  resetAllCooldowns();
  // Define a pontuação inicial como zero
  setScore(0);
  // Define a contagem de cubos como zero
  setCubeCount(0);
  // Define o tempo de spawn para o atraso inicial
  spawnTime = getSpawnDelay();
}

// Pausa o jogo, se estiver em andamento, e exibe o menu de pausa
function pauseGame() {
  // Verifica se o jogo está em andamento antes de pausá-lo
  isInGame() && setActiveMenu(MENU_PAUSE);
}

// Retoma o jogo se estiver pausado, escondendo o menu de pausa
function resumeGame() {
  // Verifica se o jogo está pausado antes de retomá-lo
  isPaused() && setActiveMenu(null);
}

// Finaliza o jogo, exibe o menu de pontuação e verifica se há uma nova pontuação máxima
function endGame() {
  // Finaliza o rastreamento do ponteiro no canvas
  handleCanvasPointerUp();
  // Verifica se há uma nova pontuação máxima e a atualiza, se necessário
  if (isNewHighScore()) {
    setHighScore(state.game.score);
  }
  // Exibe o menu de pontuação
  setActiveMenu(MENU_SCORE);
}

window.addEventListener("keydown", (event) => {
  // Verifica se a tecla pressionada é a tecla "p", pausa o jogo
  if (event.key === "p") {
    // Verifica se o jogo está pausado
    if (isPaused()) {
      // Se o jogo estiver pausado, retoma o jogo
      resumeGame();
    } else {
      // Se o jogo não estiver pausado, pausa o jogo
      pauseGame();
    }
  }
});

// Tempo de spawn inicial para o próximo alvo
let spawnTime = 0;

// Posição máxima no eixo X para o spawn do alvo
const maxSpawnX = 450;

//  representando a mudança na posição do cursor
const pointerDelta = { x: 0, y: 0 };

//  usado para ajustar a velocidade do movimento do alvo
const pointerDeltaScaled = { x: 0, y: 0 };

// Duração do efeito de câmera lenta em milissegundos
const slowmoDuration = 1500;

// Tempo restante do efeito de câmera lenta
let slowmoRemaining = 0;

// Variável para ajustar o número de alvos extras que podem ser gerados durante o efeito de câmera lenta
let spawnExtra = 0;

// Atraso entre os spawns extras durante o efeito de câmera lenta
const spawnExtraDelay = 300;

// Velocidade inicial dos alvos
let targetSpeed = 1;

function tick(width, height, simTime, simSpeed, lag) {
  // Início da medição de desempenho para o frame e o tick
  PERF_START("frame");
  PERF_START("tick");

  // Atualiza o tempo de jogo
  state.game.time += simTime;

  // Lógica para desaceleração do tempo ao ativar o slow motion
  if (slowmoRemaining > 0) {
    slowmoRemaining -= simTime;
    if (slowmoRemaining < 0) {
      slowmoRemaining = 0;
    }
    targetSpeed = pointerIsDown ? 0.075 : 0.3;
  } else {
    // Lógica para a velocidade do jogo normal
    const menuPointerDown = isMenuVisible() && pointerIsDown;
    targetSpeed = menuPointerDown ? 0.025 : 1;
  }

  // Renderiza o status do slow motion
  renderSlowmoStatus(slowmoRemaining / slowmoDuration);

  // Ajusta a velocidade do jogo com suavização
  gameSpeed += ((targetSpeed - gameSpeed) / 22) * lag;
  gameSpeed = clamp(gameSpeed, 0, 1);

  // Coordenadas do centro da tela
  const centerX = width / 2;
  const centerY = height / 2;

  // Coeficientes de arrasto do ar para simulação
  const simAirDrag = 1 - airDrag * simSpeed;
  const simAirDragSpark = 1 - airDragSpark * simSpeed;

  // Multiplicador de força para ajuste
  const forceMultiplier = 1 / (simSpeed * 0.75 + 0.25);

  // Zera as variações de posição do ponteiro
  pointerDelta.x = 0;
  pointerDelta.y = 0;
  pointerDeltaScaled.x = 0;
  pointerDeltaScaled.y = 0;

  // Obtém o último ponto de toque
  const lastPointer = touchPoints[touchPoints.length - 1];

  // Verifica se o ponteiro está pressionado, se há um último ponto de toque e se não houve interrupção no toque anterior
  if (pointerIsDown && lastPointer && !lastPointer.touchBreak) {
    // Calcula as variações de posição do ponteiro
    pointerDelta.x = pointerScene.x - lastPointer.x;
    pointerDelta.y = pointerScene.y - lastPointer.y;

    // Calcula as variações de posição escaladas com o multiplicador de força
    pointerDeltaScaled.x = pointerDelta.x * forceMultiplier;
    pointerDeltaScaled.y = pointerDelta.y * forceMultiplier;
  }

  // Calcula a velocidade do ponteiro
  const pointerSpeed = Math.hypot(pointerDelta.x, pointerDelta.y);
  const pointerSpeedScaled = pointerSpeed * forceMultiplier;

  // Atualiza o tempo de vida de todos os pontos de toque existentes
  touchPoints.forEach((p) => (p.life -= simTime));

  // Se o ponteiro estiver pressionado, adiciona um novo ponto de toque
  if (pointerIsDown) {
    touchPoints.push({
      x: pointerScene.x,
      y: pointerScene.y,
      life: touchPointLife,
    });
  }

  // Remove os pontos de toque mais antigos cuja vida tenha expirado
  while (touchPoints[0] && touchPoints[0].life <= 0) {
    touchPoints.shift();
  }

  PERF_START("entities");

  // Decrementa o tempo de spawn com base no tempo de simulação
  spawnTime -= simTime;

  // Verifica se é hora de criar um novo alvo
  if (spawnTime <= 0) {
    // Verifica se há spawnExtra disponível para ser usado
    if (spawnExtra > 0) {
      // Decrementa o contador de spawnExtra e reinicia o tempo de spawn
      spawnExtra--;
      spawnTime = spawnExtraDelay;
    } else {
      // Define um novo tempo de spawn com base na função getSpawnDelay()
      spawnTime = getSpawnDelay();
    }

    // Obtém um novo alvo
    const target = getTarget();

    // Calcula um raio de spawn com base no centro da tela e um valor máximo
    const spawnRadius = Math.min(centerX * 0.8, maxSpawnX);

    // Define as coordenadas x, y e z do alvo de forma aleatória dentro do raio de spawn
    target.x = Math.random() * spawnRadius * 2 - spawnRadius;
    target.y = centerY + targetHitRadius * 2;
    target.z = Math.random() * targetRadius * 2 - targetRadius;

    // Define as velocidades iniciais em x e y do alvo de forma aleatória
    target.xD = Math.random() * ((target.x * -2) / 120);
    target.yD = -20;

    // Adiciona o novo alvo à lista de alvos
    targets.push(target);
  }

  // Define os limites da tela e o coeficiente de amortecimento
  const leftBound = -centerX + targetRadius; // Limite esquerdo
  const rightBound = centerX - targetRadius; // Limite direito
  const ceiling = -centerY - 120; // Teto
  const boundDamping = 0.4; // Coeficiente de amortecimento

  // Atualiza a posição dos alvos e aplica limites
  targetLoop: for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];

    // Atualiza as posições com base na velocidade e no tempo de simulação
    target.x += target.xD * simSpeed;
    target.y += target.yD * simSpeed;

    // Limita a posição vertical ao teto
    if (target.y < ceiling) {
      target.y = ceiling;
      target.yD = 0;
    }

    // Aplica limites horizontais e inverte a direção com amortecimento ao atingir os limites
    if (target.x < leftBound) {
      target.x = leftBound;
      target.xD *= -boundDamping;
    } else if (target.x > rightBound) {
      target.x = rightBound;
      target.xD *= -boundDamping;
    }

    // Aplica limite para a posição z (profundidade) e inverte a direção com amortecimento ao atingir o backboardZ
    if (target.z < backboardZ) {
      target.z = backboardZ;
      target.zD *= -boundDamping;
    }

    // Aplica a aceleração devido à gravidade na direção vertical
    target.yD += gravity * simSpeed;

    // Atualiza os ângulos de rotação com base nas velocidades angulares e no tempo de simulação
    target.rotateX += target.rotateXD * simSpeed;
    target.rotateY += target.rotateYD * simSpeed;
    target.rotateZ += target.rotateZD * simSpeed;

    // Aplica a transformação 3D aos vértices do alvo
    target.transform();

    // Projeta as coordenadas 3D transformadas para coordenadas 2D de tela
    target.project();

    // Verifica se o alvo ultrapassou a linha de corte na direção vertical
    if (target.y > centerY + targetHitRadius * 2) {
      // Remove o alvo da lista de alvos
      targets.splice(i, 1);

      // Retorna o alvo à respectiva pool de objetos reutilizáveis
      returnTarget(target);

      // Realiza ações com base no estado do jogo
      if (isInGame()) {
        // Se for um jogo casual, decrementa a pontuação
        // Caso contrário, encerra o jogo
        if (isCasualGame()) {
          incrementScore(-25);
        } else {
          endGame();
        }
      }

      // Continua para o próximo alvo
      continue;
    }

    // Calcula o número de testes de colisão com base na velocidade do ponteiro e no raio do alvo
    const hitTestCount = Math.ceil((pointerSpeed / targetRadius) * 2);

    // Loop para realizar testes de colisão entre o ponteiro e o alvo
    for (let ii = 1; ii <= hitTestCount; ii++) {
      // Calcula a posição de colisão ao longo do caminho do ponteiro
      const percent = 1 - ii / hitTestCount;
      const hitX = pointerScene.x - pointerDelta.x * percent;
      const hitY = pointerScene.y - pointerDelta.y * percent;

      // Calcula a distância entre a posição de colisão e a projeção do alvo no plano 2D
      const distance = Math.hypot(
        hitX - target.projected.x,
        hitY - target.projected.y
      );

      // Verifica se ocorreu uma colisão
      if (distance <= targetHitRadius) {
        if (!target.hit) {
          // Atualiza propriedades do alvo e adiciona efeitos de colisão
          target.hit = true;
          target.xD += pointerDeltaScaled.x * hitDampening;
          target.yD += pointerDeltaScaled.y * hitDampening;
          target.rotateXD += pointerDeltaScaled.y * 0.001;
          target.rotateYD += pointerDeltaScaled.x * 0.001;

          // Calcula a velocidade das partículas de faísca com base na velocidade do ponteiro
          const sparkSpeed = 7 + pointerSpeedScaled * 0.125;

          if (pointerSpeedScaled > minPointerSpeed) {
            // Atualiza pontuação e saúde do alvo após uma colisão bem-sucedida
            target.health--;
            incrementScore(10);

            if (target.health <= 0) {
              // Cria uma explosão de partículas e faíscas ao destruir o alvo
              incrementCubeCount(1);
              createBurst(target, forceMultiplier);
              sparkBurst(hitX, hitY, 8, sparkSpeed);
              if (target.wireframe) {
                // Ativa o efeito de câmera lenta e gera alvos adicionais após destruir um alvo de arame
                slowmoRemaining = slowmoDuration;
                spawnTime = 0;
                spawnExtra = 2;
              }
              // Remove o alvo do array de alvos e o retorna ao pool
              targets.splice(i, 1);
              returnTarget(target);
            } else {
              // Cria faíscas e atualiza a saúde do alvo após uma colisão
              sparkBurst(hitX, hitY, 8, sparkSpeed);
              glueShedSparks(target);
              updateTargetHealth(target, 0);
            }
          } else {
            // Incrementa a pontuação para colisões de baixa velocidade
            incrementScore(5);
            sparkBurst(hitX, hitY, 3, sparkSpeed);
          }
        }

        // Continua para o próximo alvo
        continue targetLoop;
      }
    }

    target.hit = false;
  }

  // Z-coordenada da parte de trás, ajustada para acomodar as partículas
  const fragBackboardZ = backboardZ + fragRadius;

  // Limites horizontais para as partículas
  const fragLeftBound = -width;
  const fragRightBound = width;

  // Loop para atualizar as partículas (frags) no cenário
  for (let i = frags.length - 1; i >= 0; i--) {
    const frag = frags[i];

    // Atualização da posição das partículas com base na velocidade e arrasto
    frag.x += frag.xD * simSpeed;
    frag.y += frag.yD * simSpeed;
    frag.z += frag.zD * simSpeed;

    // Aplicação de arrasto às velocidades das partículas
    frag.xD *= simAirDrag;
    frag.yD *= simAirDrag;
    frag.zD *= simAirDrag;

    // Restrição da posição vertical da partícula
    if (frag.y < ceiling) {
      frag.y = ceiling;
      frag.yD = 0;
    }

    // Restrição da posição em Z da partícula em relação à parte de trás do tabuleiro
    if (frag.z < fragBackboardZ) {
      frag.z = fragBackboardZ;
      frag.zD *= -boundDamping;
    }

    // Aplicação da força da gravidade na direção vertical
    frag.yD += gravity * simSpeed;

    // Atualização das rotações das partículas
    frag.rotateX += frag.rotateXD * simSpeed;
    frag.rotateY += frag.rotateYD * simSpeed;
    frag.rotateZ += frag.rotateZD * simSpeed;

    // Transformação e projeção da partícula no cenário
    frag.transform();
    frag.project();

    // Verificação se a partícula saiu dos limites ou ultrapassou a posição Z de desvanecimento da câmera
    if (
      frag.projected.y > centerY + targetHitRadius ||
      frag.projected.x < fragLeftBound ||
      frag.projected.x > fragRightBound ||
      frag.z > cameraFadeEndZ
    ) {
      // Remoção da partícula caso tenha saído dos limites
      frags.splice(i, 1);
      returnFrag(frag);
      continue;
    }
  }

  // Loop para atualizar as faíscas (sparks) no cenário
  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i];

    // Redução do tempo de vida da faísca
    spark.life -= simTime;

    // Verificação se a faísca atingiu o fim de sua vida
    if (spark.life <= 0) {
      // Remoção da faísca caso tenha atingido o fim de sua vida
      sparks.splice(i, 1);
      returnSpark(spark);
      continue;
    }

    // Atualização da posição da faísca com base na velocidade e arrasto
    spark.x += spark.xD * simSpeed;
    spark.y += spark.yD * simSpeed;

    // Aplicação de arrasto às velocidades da faísca
    spark.xD *= simAirDragSpark;
    spark.yD *= simAirDragSpark;

    // Aplicação da força da gravidade na direção vertical da faísca
    spark.yD += gravity * simSpeed;
  }

  // Fim da medição de desempenho para entidades (entities)
  PERF_END("entities");

  // Início da medição de desempenho para renderização 3D
  PERF_START("3D");

  // Limpeza dos arrays que armazenam vértices e polígonos para renderização
  allVertices.length = 0;
  allPolys.length = 0;
  allShadowVertices.length = 0;
  allShadowPolys.length = 0;

  // Iteração sobre os alvos (targets) para coletar vértices e polígonos
  targets.forEach((entity) => {
    allVertices.push(...entity.vertices);
    allPolys.push(...entity.polys);
    allShadowVertices.push(...entity.shadowVertices);
    allShadowPolys.push(...entity.shadowPolys);
  });

  // Iteração sobre os fragmentos (frags) para coletar vértices e polígonos
  frags.forEach((entity) => {
    allVertices.push(...entity.vertices);
    allPolys.push(...entity.polys);
    allShadowVertices.push(...entity.shadowVertices);
    allShadowPolys.push(...entity.shadowPolys);
  });

  // Computação das normais dos polígonos no espaço da tela e cálculo da profundidade
  allPolys.forEach((p) => computePolyNormal(p, "normalWorld"));
  allPolys.forEach(computePolyDepth);
  allPolys.sort((a, b) => b.depth - a.depth);

  // Projeção dos vértices no espaço da câmera
  allVertices.forEach(projectVertex);

  // Computação das normais dos polígonos no espaço da câmera
  allPolys.forEach((p) => computePolyNormal(p, "normalCamera"));

  PERF_END("3D");

  PERF_START("shadows");

  // Transformação dos vértices das sombras
  transformVertices(
    allShadowVertices,
    allShadowVertices,
    0,
    0,
    0,
    TAU / 8, // Rotação em torno do eixo Y por um oitavo de volta (45 graus)
    0,
    0,
    1,
    1,
    1
  );

  // Cálculo das normais das sombras 
  allShadowPolys.forEach((p) => computePolyNormal(p, "normalWorld"));

  // Ajuste da posição das sombras com base na distância do backboard
  const shadowDistanceMult = Math.hypot(1, 1);
  const shadowVerticesLength = allShadowVertices.length;
  for (let i = 0; i < shadowVerticesLength; i++) {
    const distance = allVertices[i].z - backboardZ;
    allShadowVertices[i].z -= shadowDistanceMult * distance;
  }

  // Transformação dos vértices das sombras
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

// Função para renderizar os elementos do jogo no contexto 2D do canvas
function draw(ctx, width, height, viewScale) {
  PERF_START("draw");

  // Calcula as coordenadas do centro do canvas
  const halfW = width / 2;
  const halfH = height / 2;

  // Configura o estilo de união das linhas
  ctx.lineJoin = "bevel";

  // Início de medição de desempenho para desenhar sombras
  PERF_START("drawShadows");
  // Configuração de cor para sombras
  ctx.fillStyle = shadowColor;
  ctx.strokeStyle = shadowColor;
  // Itera sobre todos os polígonos de sombra
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
  // Fim de medição de desempenho para desenhar sombras
  PERF_END("drawShadows");
  // Início de medição de desempenho para desenhar polígonos
  PERF_START("drawPolys");

  // Itera sobre todos os polígonos
  allPolys.forEach((p) => {
    if (!p.wireframe && p.normalCamera.z < 0) return;

    // Ignora polígonos sem preenchimento que estão atrás da câmera
    if (p.strokeWidth !== 0) {
      ctx.lineWidth =
        p.normalCamera.z < 0 ? p.strokeWidth * 0.5 : p.strokeWidth;
      ctx.strokeStyle =
        p.normalCamera.z < 0 ? p.strokeColorDark : p.strokeColor;
    }

    const { vertices } = p;
    const lastV = vertices[vertices.length - 1];
    const fadeOut = p.middle.z > cameraFadeStartZ;

    // Configurações para preenchimento do polígono
    if (!p.wireframe) {
      const normalLight = p.normalWorld.y * 0.5 + p.normalWorld.z * -0.5;
      const lightness =
        normalLight > 0
          ? 0.1
          : ((normalLight ** 32 - normalLight) / 2) * 0.9 + 0.1;
      ctx.fillStyle = shadeColor(p.color, lightness);
    }

    // Aplica a redução de opacidade para polígonos fora da visão da câmera
    if (fadeOut) {
      ctx.globalAlpha = Math.max(
        0,
        1 - (p.middle.z - cameraFadeStartZ) / cameraFadeRange
      );
    }

    // Desenha os polígonos
    ctx.beginPath();
    ctx.moveTo(lastV.x, lastV.y);
    for (let v of vertices) {
      ctx.lineTo(v.x, v.y);
    }

    if (!p.wireframe) {
      ctx.fill();
    }

    // Desenha a borda se a largura da borda for diferente de zero
    if (p.strokeWidth !== 0) {
      ctx.stroke();
    }

    // Restaura a opacidade global se houve redução
    if (fadeOut) {
      ctx.globalAlpha = 1;
    }
  });
  // Fim de medição de desempenho para desenhar polígonos
  PERF_END("drawPolys");

  // Início de medição de desempenho para desenhar elementos 2D
  PERF_START("draw2D");

  // Configurações para faíscas
  ctx.strokeStyle = sparkColor;
  ctx.lineWidth = sparkThickness;
  ctx.beginPath();
  sparks.forEach((spark) => {
    ctx.moveTo(spark.x, spark.y);

    const scale = (spark.life / spark.maxLife) ** 0.5 * 1.5;
    ctx.lineTo(spark.x - spark.xD * scale, spark.y - spark.yD * scale);
  });
  ctx.stroke();

  // Configurações para desenhar trilhas de toque
  ctx.strokeStyle = touchTrailColor;
  const touchPointCount = touchPoints.length;
  // Itera sobre os pontos de toque
  for (let i = 1; i < touchPointCount; i++) {
    const current = touchPoints[i];
    const prev = touchPoints[i - 1];
    // Ignora pontos de quebra no toque
    if (current.touchBreak || prev.touchBreak) {
      continue;
    }

    // Calcula a escala com base na vida do ponto de toque
    const scale = current.life / touchPointLife;

    // Desenha a trilha entre os pontos de toque
    ctx.lineWidth = scale * touchTrailThickness;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }
  // Fim de medição de desempenho para desenhar elementos 2D
  PERF_END("draw2D");

  // Fim de medição de desempenho para desenhar
  PERF_END("draw");

  // Fim de medição de desempenho para o frame
  PERF_END("frame");

  // Atualiza as métricas de desempenho
  PERF_UPDATE();
}

// Configuração inicial do canvas
function setupCanvases() {
  // Obtém o contexto 2D do canvas
  const ctx = canvas.getContext("2d");

  // Obtém o rácio de pixels do dispositivo (DPR)
  const dpr = window.devicePixelRatio || 1;

  // Variáveis para escala de visualização e dimensões do canvas
  let viewScale;
  let width, height;

  // Função para lidar com o redimensionamento da janela
  function handleResize() {
    // Obtém as dimensões da janela
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Calcula a escala de visualização
    viewScale = h / 1000;

    // Calcula as dimensões do canvas ajustadas pela escala
    width = w / viewScale;
    height = h / viewScale;

    // Define as dimensões físicas do canvas e ajusta o estilo para o tamanho visual
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
  }

  // Chama a função de redimensionamento inicial
  handleResize();

  // Adiciona um ouvinte de eventos para redimensionamento da janela
  window.addEventListener("resize", handleResize);

  // Variável para armazenar o último timestamp do frame
  let lastTimestamp = 0;

  // Função de manipulação de quadro principal
  function frameHandler(timestamp) {
    // Calcula o tempo decorrido desde o último quadro
    let frameTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Chama a função para solicitar o próximo quadro
    raf();

    // Se o jogo estiver pausado, interrompe a execução
    if (isPaused()) return;

    // Limita o tempo de frame para evitar grandes saltos em caso de pausa
    if (frameTime < 0) {
      frameTime = 17;
    } else if (frameTime > 68) {
      frameTime = 68;
    }

    // Calcula as coordenadas do ponteiro na cena
    const halfW = width / 2;
    const halfH = height / 2;
    pointerScene.x = pointerScreen.x / viewScale - halfW;
    pointerScene.y = pointerScreen.y / viewScale - halfH;

    // Calcula o lag e o tempo de simulação com base no tempo de quadro
    const lag = frameTime / 16.6667;
    const simTime = gameSpeed * frameTime;
    const simSpeed = gameSpeed * lag;

    // Chama a função principal de atualização do jogo (tick)
    tick(width, height, simTime, simSpeed, lag);

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica a escala de desenho e a translação para centrar a cena
    const drawScale = dpr * viewScale;
    ctx.scale(drawScale, drawScale);
    ctx.translate(halfW, halfH);

    // Chama a função de desenho principal
    draw(ctx, width, height, viewScale);

    // Restaura a transformação do contexto para o estado inicial
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // Função para solicitar o próximo quadro
  const raf = () => requestAnimationFrame(frameHandler);

  // Inicializa o loop de quadros
  raf();
}

// Função chamada quando o ponteiro é pressionado no canvas
function handleCanvasPointerDown(x, y) {
  // Verifica se o ponteiro não estava pressionado antes
  if (!pointerIsDown) {
    // Marca que o ponteiro está pressionado
    pointerIsDown = true;
    // Atualiza as coordenadas do ponteiro na tela
    pointerScreen.x = x;
    pointerScreen.y = y;

    // Se o menu estiver visível, renderiza os menus para refletir a mudança
    if (isMenuVisible()) renderMenus();
  }
}

// Função chamada quando o ponteiro é liberado no canvas
function handleCanvasPointerUp() {
  // Verifica se o ponteiro estava pressionado antes
  if (pointerIsDown) {
    // Marca que o ponteiro não está mais pressionado
    pointerIsDown = false;
    // Adiciona um ponto de toque indicando uma interrupção no toque
    touchPoints.push({
      touchBreak: true,
      life: touchPointLife,
    });

    // Se o menu estiver visível, renderiza os menus para refletir a mudança
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
