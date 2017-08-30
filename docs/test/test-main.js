(() => {
  const TitleScene = class extends Scene {
    constructor() {
      super('title');
    }

    static get COLUMNS() {
      return [
        'Painter2d',
        'ActionManager',
        'SoundManager',
        'Logger',
        'Scene',
        'StdTransFunc',
        'Tween'
      ];
    }

    static get ROWS() {
      return [
        ['background', 'rectangle', 'round rectangle', 'circle', 'ellipse', 'diamond', 'polygon', 'text', 'image', 'draw mode'],
        ['keyboard', 'mouse'],
        ['SE', 'BGM', 'sound test'],
        ['debug', 'info', 'warn', 'error', 'fatal'],
        ['transition', 'end', 'reset'],
        ['cut', 'fade', 'fadeWithColor', 'push', 'wipe', 'stripeIn', 'stripeOut', 'checker', 'gateIn', 'gateOut', 'silhouetteIn', 'silhouetteOut'],
        ['no data']
      ];
    }

    init(state, counters, game) {
      return State.init({
        column: 0,
        row: 0
      });
    }

    update(state, action, counters, sound, game) {
      let column = state.getState('column');
      let row = state.getState('row');

      if (action.keyboard.isPressed('ArrowRight')) {
        column = (column + 1) % TitleScene.COLUMNS.length;
        row = 0;
      }
      if (action.keyboard.isPressed('ArrowLeft')) {
        column = (column - 1 + TitleScene.COLUMNS.length) % TitleScene.COLUMNS.length;
        row = 0;
      }
      if (action.keyboard.isPressed('ArrowUp'))
        row = (row - 1 + TitleScene.ROWS[column].length) % TitleScene.ROWS[column].length;
      if (action.keyboard.isPressed('ArrowDown'))
        row = (row + 1) % TitleScene.ROWS[column].length;

      if (column === 3 && action.keyboard.isPressed('Space', 'Enter')) {
        switch (row) {
        case 0:
          Logger.debug('debug message');
          break;
        case 1:
          Logger.info('info message');
          break;
        case 2:
          Logger.warn('warning message');
          break;
        case 3:
          Logger.error('error message');
          break;
        case 4:
          Logger.fatal('fatal error message');
          break;
        }
      }
      return state.setStates({ column, row });
    }

    draw(state, action, counters, painter, game) {
      const column = state.getState('column');

      if (column === 5) painter.background('#333');
      else painter.background('#000');
      painter.text(TitleScene.COLUMNS[column], game.width / 2, 40, { align: 'center', baseline: 'middle', size: 32, font: 'Limelight' }).fill('#0f0');
      TitleScene.ROWS[column].forEach((row, i) => {
        const rowText = painter.text(row, game.width / 2, 100 + i * 30, { size: 26 });
        if (i === state.getState('row'))
          rowText.fill('#ff0');
        else
          rowText.fill('#0f0');
      });
    }

    transition(state, action, counters, game) {
      const column = state.getState('column');
      const row = state.getState('row');

      if (action.keyboard.isPressed('Space', 'Enter')) {
        switch (column) {
        case 0:
          return Transition.Trans(`Painter2d-${row}`);
          break;
        case 1:
          return Transition.Trans(`ActionManager-${row}`);
          break;
        case 2:
          if (row === 0) return Transition.Trans(`SoundManager-${row}`);
          break;
        case 4:
          if (row === 0) return Transition.Trans('title');
          if (row === 1) return Transition.End();
          if (row === 2) return Transition.Reset();
          break;
        case 5:
          if (row === 0) return Transition.Trans('title', { transFunc: StdTransFunc.cut });
          if (row === 1) return Transition.Trans('title', { transFunc: StdTransFunc.fade(60) });
          if (row === 2) return Transition.Trans('title', { transFunc: StdTransFunc.fadeWithColor(60, '#999') });
          if (row === 3) return Transition.Trans('title', { transFunc: StdTransFunc.push(60, Directions.S, x => x ** 3) });
          if (row === 4) return Transition.Trans('title', { transFunc: StdTransFunc.wipe(60, Directions.E) });
          if (row === 5) return Transition.Trans('title', { transFunc: StdTransFunc.stripeIn(60, Directions.N, { num: 16 }) });
          if (row === 6) return Transition.Trans('title', { transFunc: StdTransFunc.stripeOut(60, Directions.S, { num: 16 }) });
          // if (row === 7) return Transition.Trans('title', { transFunc: StdTransFunc.checker(60, Directions.S, { num: 16 }) });
          // if (row === 8) return Transition.Trans('title', { transFunc: StdTransFunc.gateIn(60, Directions.S, { num: 16 }) });
          // if (row === 9) return Transition.Trans('title', { transFunc: StdTransFunc.gateOut(60, Directions.S, { num: 16 }) });
          if (row === 10) return Transition.Trans('title', {
            transFunc: StdTransFunc.silhouetteIn(90, game.width / 2, game.height / 2, painter => {
              // painter.diamond(game.width / 4, game.height / 4, game.width / 2, game.height / 2).fill('#000');
              painter.image('box-sprite', game.width / 2, game.height / 2, { relativeOrigin: Directions.C });
            })
          });
          if (row === 11) return Transition.Trans('title', {
            transFunc: StdTransFunc.silhouetteOut(90, game.width / 2, game.height / 2, painter => {
              // painter.diamond(game.width / 4, game.height / 4, game.width / 2, game.height / 2).fill('#000');
              painter.image('box-sprite', game.width / 2, game.height / 2, { relativeOrigin: Directions.C });
            })
          });
          break;
        case 6:
          break;
        }
      }
      return Transition.Stay();
    }
  };

  const PainterTestScene0 = class extends Scene {
    constructor() {
      super('Painter2d-0');
    }

    init(state, counters, game) {
      return State.init({
        progress: 0
      });
    }

    update(state, action, counters, sound, game) {
      if (action.keyboard.isPressed('Space', 'Enter'))
        return state.modifyState('progress', x => x + 1);
      return state;
    }

    draw(state, action, counters, painter, game) {
      switch (state.getState('progress')) {
      case 0:
        painter.background('#384d98');
        break;
      default:
        painter.background(painter.createPattern('pattern'));
      }
    }

    transition(state, action, counters, game) {
      return state.getState('progress') >= 2 ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene1 = class extends Scene {
    constructor() {
      super('Painter2d-1');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      painter.background('#fff');

      painter.rect(10, 10, 40, 40).fill("#f00");
      painter.rect(10, 70, 180, 60).fill("#0f0");
      painter.rect(70, 10, 60, 180).fill("#00f");
      painter.rect(190, 190, -40, -40).fill("#000");

      painter.rect(210, 10, 40, 40).stroke("#f00", { width: 1, join: 'miter', miterLimit: 10.0 });
      painter.rect(210, 70, 180, 60).stroke("#0f0", { width: 2, miterLimit: 0.4 });
      painter.rect(270, 10, 60, 180).stroke("#00f", { width: 3, join: 'round' });
      painter.rect(390, 190, -40, -40).stroke("#000", { width: 4, join: 'bevel' });

      painter.rect(410, 10, 40, 40).outlined("#f00", "#999", 4);
      painter.rect(410, 70, 180, 60).outlined("#0f0", "#999", 3);
      painter.rect(470, 10, 60, 180).outlined("#00f", "#999", 2);
      painter.rect(590, 190, -40, -40).outlined("#000", "#999", 1);

      painter.rect(10, 210, 180, 80).fill(patternStyle);
      painter.rect(210, 210, 180, 80).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.rect(410, 210, 180, 80).outlined(patternStyle, "#384d98", 2);

      painter.rect(10, 310, 180, 80).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene2 = class extends Scene {
    constructor() {
      super('Painter2d-2');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      painter.background('#fff');

      painter.roundRect(10, 10, 40, 40, 5).fill("#f00");
      painter.roundRect(10, 70, 180, 60, 10).fill("#0f0");
      painter.roundRect(70, 10, 60, 180, 15).fill("#00f");
      painter.roundRect(190, 190, -40, -40, 20).fill("#000");

      painter.roundRect(210, 10, 40, 40, 5).stroke("#f00", { width: 1, join: 'miter', miterLimit: 10.0 });
      painter.roundRect(210, 70, 180, 60, 10).stroke("#0f0", { width: 2, miterLimit: 0.4 });
      painter.roundRect(270, 10, 60, 180, 15).stroke("#00f", { width: 3, join: 'round' });
      painter.roundRect(390, 190, -40, -40, 20).stroke("#000", { width: 4, join: 'bevel' });

      painter.roundRect(410, 10, 40, 40, 5).outlined("#f00", "#999", 4);
      painter.roundRect(410, 70, 180, 60, 10).outlined("#0f0", "#999", 3);
      painter.roundRect(470, 10, 60, 180, 15).outlined("#00f", "#999", 2);
      painter.roundRect(590, 190, -40, -40, 20).outlined("#000", "#999", 1);

      painter.roundRect(10, 210, 180, 80, 20).fill(patternStyle);
      painter.roundRect(210, 210, 180, 80, 20).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.roundRect(410, 210, 180, 80, 20).outlined(patternStyle, "#384d98", 2);

      painter.roundRect(10, 310, 180, 80, 20).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene3 = class extends Scene {
    constructor() {
      super('Painter2d-3');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      painter.background('#fff');

      painter.circle(70, 70, 60).fill("#f00");
      painter.circle(130, 130, -60).fill("#00f");

      painter.circle(270, 70, 60).stroke("#f00", { width: 1 });
      painter.circle(330, 130, -60).stroke("#00f", { width: 4 });

      painter.circle(470, 70, 60).outlined("#f00", "#999", 4);
      painter.circle(530, 130, -60).outlined("#00f", "#999", 1);

      painter.circle(100, 250, 50).fill(patternStyle);
      painter.circle(300, 250, 50).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.circle(500, 250, 50).outlined(patternStyle, "#384d98", 2);

      painter.circle(150, 350, 50).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene4 = class extends Scene {
    constructor() {
      super('Painter2d-4');
    }

    init(state, counters, game) {
      return State.init({
        rotation: 0
      });
    }

    update(state, action, counters, sound, game) {
      if (action.keyboard.isDown('ArrowRight')) return state.modifyState('rotation', x => x + 1);
      if (action.keyboard.isDown('ArrowLeft')) return state.modifyState('rotation', x => x - 1);
      return state;
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      const rot = state.getState('rotation');
      painter.background('#fff');

      painter.ellipse(30, 30, 20, 20, KoturnoUtil.toRadians(rot)).fill("#f00");
      painter.ellipse(100, 100, 90, 30, KoturnoUtil.toRadians(rot)).fill("#0f0");
      painter.ellipse(100, 100, 30, 90, KoturnoUtil.toRadians(rot)).fill("#00f");
      painter.ellipse(170, 170, -20, -20, KoturnoUtil.toRadians(rot)).fill("#000");

      painter.ellipse(230, 30, 20, 20, KoturnoUtil.toRadians(rot)).stroke("#f00", { width: 1, join: 'miter', miterLimit: 10.0 });
      painter.ellipse(300, 100, 90, 30, KoturnoUtil.toRadians(rot)).stroke("#0f0", { width: 2, miterLimit: 0.4 });
      painter.ellipse(300, 100, 30, 90, KoturnoUtil.toRadians(rot)).stroke("#00f", { width: 3, join: 'round' });
      painter.ellipse(370, 170, -20, -20, KoturnoUtil.toRadians(rot)).stroke("#000", { width: 4, join: 'bevel' });

      painter.ellipse(430, 30, 20, 20, KoturnoUtil.toRadians(rot)).outlined("#f00", "#999", 4);
      painter.ellipse(500, 100, 90, 30, KoturnoUtil.toRadians(rot)).outlined("#0f0", "#999", 3);
      painter.ellipse(500, 100, 30, 90, KoturnoUtil.toRadians(rot)).outlined("#00f", "#999", 2);
      painter.ellipse(570, 170, -20, -20, KoturnoUtil.toRadians(rot)).outlined("#000", "#999", 1);

      painter.ellipse(100, 250, 90, 40).fill(patternStyle);
      painter.ellipse(300, 250, 90, 40).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.ellipse(500, 250, 90, 40).outlined(patternStyle, "#384d98", 2);

      painter.ellipse(100, 350, 90, 40).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene5 = class extends Scene {
    constructor() {
      super('Painter2d-5');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      painter.background('#fff');

      painter.diamond(10, 10, 40, 40).fill("#f00");
      painter.diamond(10, 70, 180, 60).fill("#0f0");
      painter.diamond(70, 10, 60, 180).fill("#00f");
      painter.diamond(190, 190, -40, -40).fill("#000");

      painter.diamond(210, 10, 40, 40).stroke("#f00", { width: 1, join: 'miter', miterLimit: 10.0 });
      painter.diamond(210, 70, 180, 60).stroke("#0f0", { width: 2, miterLimit: 0.4 });
      painter.diamond(270, 10, 60, 180).stroke("#00f", { width: 3, join: 'round' });
      painter.diamond(390, 190, -40, -40).stroke("#000", { width: 4, join: 'bevel' });

      painter.diamond(410, 10, 40, 40).outlined("#f00", "#999", 4);
      painter.diamond(410, 70, 180, 60).outlined("#0f0", "#999", 3);
      painter.diamond(470, 10, 60, 180).outlined("#00f", "#999", 2);
      painter.diamond(590, 190, -40, -40).outlined("#000", "#999", 1);

      painter.diamond(10, 210, 180, 80).fill(patternStyle);
      painter.diamond(210, 210, 180, 80).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.diamond(410, 210, 180, 80).outlined(patternStyle, "#384d98", 2);

      painter.diamond(10, 310, 180, 80).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene6 = class extends Scene {
    constructor() {
      super('Painter2d-6');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      const star = (x, y, r) => {
        return [0, 1, 2, 3, 4]
          .map(i => KoturnoUtil.toRadians(144 * i))
          .map(rad => new Point2d(x - r * Math.sin(rad), y - r * Math.cos(rad)));
      };
      painter.background('#fff');

      painter.polygon([new Point2d(30, 10), new Point2d(10, 50), new Point2d(50, 50)]).fill("#f00");
      painter.polygon([new Point2d(10, 130), new Point2d(130, 130), new Point2d(190, 70), new Point2d(70, 70)]).fill("#0f0");
      painter.polygon([new Point2d(100, 10), new Point2d(70, 40), new Point2d(100, 190), new Point2d(130, 40)]).fill("#00f");
      painter.polygon(star(170, 170, 20)).fill("#000");

      painter.polygon([new Point2d(230, 10), new Point2d(210, 50), new Point2d(250, 50)]).stroke("#f00", { width: 1, join: 'miter', miterLimit: 10.0 });
      painter.polygon([new Point2d(210, 130), new Point2d(330, 130), new Point2d(390, 70), new Point2d(270, 70)]).stroke("#0f0", { width: 2, miterLimit: 0.4 });
      painter.polygon([new Point2d(300, 10), new Point2d(270, 40), new Point2d(300, 190), new Point2d(330, 40)]).stroke("#00f", { width: 3, join: 'round' });
      painter.polygon(star(370, 170, 20)).stroke("#000", { width: 4, join: 'bevel' });

      painter.polygon([new Point2d(430, 10), new Point2d(410, 50), new Point2d(450, 50)]).outlined("#f00", "#999", 4);
      painter.polygon([new Point2d(410, 130), new Point2d(530, 130), new Point2d(590, 70), new Point2d(470, 70)]).outlined("#0f0", "#999", 3);
      painter.polygon([new Point2d(500, 10), new Point2d(470, 40), new Point2d(500, 190), new Point2d(530, 40)]).outlined("#00f", "#999", 2);
      painter.polygon(star(570, 170, 20)).outlined("#000", "#999", 1);

      painter.polygon([new Point2d(10, 290), new Point2d(70, 250), new Point2d(130, 290), new Point2d(190, 210), new Point2d(130, 250), new Point2d(70, 210)]).fill(patternStyle);
      painter.polygon([new Point2d(210, 290), new Point2d(270, 250), new Point2d(330, 290), new Point2d(390, 210), new Point2d(330, 250), new Point2d(270, 210)]).stroke(patternStyle, { width: 6, join: 'miter', miterLimit: 10.0 });
      painter.polygon([new Point2d(410, 290), new Point2d(470, 250), new Point2d(530, 290), new Point2d(590, 210), new Point2d(530, 250), new Point2d(470, 210)]).outlined(patternStyle, "#384d98", 2);

      painter.polygon([new Point2d(10, 390), new Point2d(70, 350), new Point2d(130, 390), new Point2d(190, 310), new Point2d(130, 350), new Point2d(70, 310)]).clipAndDraw(() => {
        painter.background(patternStyle);
        painter.circle(160, 420, 150).fill("#0f0");
        painter.circle(190, 280, 80).fill("#00f");
        painter.circle(50, 270, 120).stroke("#f00", { width: 1 });
      });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene7 = class extends Scene {
    constructor() {
      super('Painter2d-7');
    }

    init(state, counters, game) {
      return State.init({
        progress: 0
      });
    }

    update(state, action, counters, sound, game) {
      if (action.keyboard.isPressed('Space', 'Enter')) return state.modifyState('progress', x => x + 1);
      return state;
    }

    draw(state, action, counters, painter, game) {
      const patternStyle = painter.createPattern('pattern');
      const lorem = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;
      const progress = state.getState('progress');
      painter.background('#000');

      if (progress === 0) {
        painter.text(lorem, 10, 20, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: '100%' }).fill('#f00');
        painter.text(lorem, 10, 100, { align: 'left' }).fill('#ff0');
        painter.text(lorem, game.width / 2, 180, { align: 'center' }).fill('#0f0');
        painter.text(lorem, game.width - 10, 260, { align: 'right' }).fill('#0ff');
        painter.text(lorem, game.width - 10, 340, { align: 'end' }).fill('#00f');

        painter.rect(10, 500, 580, 1).fill('#fff');
        painter.text('top', 20, 500, { align: 'left', baseline: 'top', size: 18 }).fill('#f00');
        painter.text('hanging', 60, 500, { baseline: 'hanging' }).fill('#f00');
        painter.text('middle', 150, 500, { baseline: 'middle' }).fill('#f00');
        painter.text('alphabetic', 230, 500, { baseline: 'alphabetic' }).fill('#f00');
        painter.text('ideographic', 345, 500, { baseline: 'ideographic' }).fill('#f00');
        painter.text('bottom', 470, 500, { baseline: 'bottom' }).fill('#f00');
      } else if (progress === 1) {
        painter.text(lorem, 10, 20, { align: 'start', baseline: 'alphabetic', size: 12 }).stroke('#f00', { width: 0.3 });
        painter.text(lorem, 10, 100, { align: 'left' }).stroke('#ff0', { width: 0.6 });
        painter.text(lorem, game.width / 2, 180, { align: 'center' }).stroke('#0f0', { width: 1 });
        painter.text(lorem, game.width - 10, 260, { align: 'right' }).stroke('#0ff', { width: 1.5 });
        painter.text(lorem, game.width - 10, 340, { align: 'end' }).stroke('#00f', { width: 2 });

        painter.rect(10, 500, 580, 1).fill('#fff');
        painter.text('top', 20, 500, { align: 'left', baseline: 'top', size: 18 }).stroke('#f00', { width: 1 });
        painter.text('hanging', 60, 500, { baseline: 'hanging' }).stroke('#f00');
        painter.text('middle', 150, 500, { baseline: 'middle' }).stroke('#f00');
        painter.text('alphabetic', 230, 500, { baseline: 'alphabetic' }).stroke('#f00');
        painter.text('ideographic', 345, 500, { baseline: 'ideographic' }).stroke('#f00');
        painter.text('bottom', 470, 500, { baseline: 'bottom' }).stroke('#f00');
      } else if (progress === 2) {
        painter.text(lorem, 10, 20, { align: 'start', baseline: 'alphabetic', size: 12 }).outlined('#f00', '#066', 0.3);
        painter.text(lorem, 10, 100, { align: 'left' }).outlined('#ff0', '#006', 0.6);
        painter.text(lorem, game.width / 2, 180, { align: 'center' }).outlined('#0f0', '#606', 1);
        painter.text(lorem, game.width - 10, 260, { align: 'right' }).outlined('#0ff', '#600', 1.5);
        painter.text(lorem, game.width - 10, 340, { align: 'end' }).outlined('#00f', '#660', 2);

        painter.rect(10, 500, 580, 1).fill('#fff');
        painter.text('top', 20, 500, { align: 'left', baseline: 'top', size: 18 }).outlined('#f00', '#ccc', 1);
        painter.text('hanging', 60, 500, { baseline: 'hanging' }).outlined('#f00', '#ccc', 1);
        painter.text('middle', 150, 500, { baseline: 'middle' }).outlined('#f00', '#ccc', 1);
        painter.text('alphabetic', 230, 500, { baseline: 'alphabetic' }).outlined('#f00', '#ccc', 1);
        painter.text('ideographic', 345, 500, { baseline: 'ideographic' }).outlined('#f00', '#ccc', 1);
        painter.text('bottom', 470, 500, { baseline: 'bottom' }).outlined('#f00', '#ccc', 1);
      } else {
        painter.text(lorem, 10, 20, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: '100%' }).fill('#f00');
        painter.text(lorem, 10, 100, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: '80%' }).fill('#ff0');
        painter.text(lorem, 10, 180, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: '120%' }).fill('#0f0');
        painter.text(lorem, 10, 260, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: '10px' }).fill('#0ff');
        painter.text(lorem, 10, 340, { align: 'start', baseline: 'alphabetic', size: 12, lineHeight: 14 }).fill('#00f');
      }
    }

    transition(state, action, counters, game) {
      return state.getState('progress') >= 4 ? Transition.Trans('title') : Transition.Stay();
    }
  }

  const PainterTestScene8 = class extends Scene {
    constructor() {
      super('Painter2d-8');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      painter.background('#fff');

      painter.image('box', 10, 10);
      painter.image('box', 210, 10, { width: 96, height: 64 });
      painter.image('box', 310, 10, { width: 96 });
      painter.image('box', 410, 10, { height: 64 });
      painter.image('box', 10, 160, { height: 64, keepAspectRatio: true });
      painter.image('box', 110, 160, { width: 96, keepAspectRatio: true });
      painter.image('box', 500, 160, { relativeOrigin: Directions.C });
      painter.image('box', 10, 260, { crop: { x: 0, y: 0, width: 32, height: 32 } });
      painter.image('box', 60, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, width: 64, height: 48 });
      painter.image('box', 160, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, width: 64 });
      painter.image('box', 260, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, height: 48 });
      painter.image('box', 310, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, width: 64, height: 48, keepAspectRatio: true });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.C });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.NW });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.N });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.NE });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.W });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.E });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.SW });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.S });
      painter.image('box', 500, 260, { crop: { x: 0, y: 0, width: 32, height: 32 }, relativeOrigin: Directions.SE });
      painter.image('box', 10, 360, { crop: { y: (Math.floor(counters.scene / 12) % 4) * 32, height: 32 } });
      painter.image('box-sprite', 10, 400);
      painter.image('box-sprite', 60, 400, { spriteID: 16, width: 96 });
      painter.image('box-sprite', 160, 400, { spriteID: 33, width: 64, height: 48, keepAspectRatio: true });
      painter.image('box-sprite', 260, 400, { spriteID: 2 + 6 * Math.floor(counters.scene / 12) });
      painter.image('box-sprite', 310, 400, { spriteID: 5 + 6 * Math.floor(counters.scene / 12), crop: { width: 16 } });
      painter.image('box-sprite', 360, 400, { spriteID: 1 + 6 * Math.floor(counters.scene / 12), crop: { x: 16, y: 16 } });
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const PainterTestScene9 = class extends Scene {
    constructor() {
      super('Painter2d-9');
    }

    init(state, counters, game) {
      return State.init({
        progress: 0
      });
    }

    update(state, action, counters, sound, game) {
      if (action.keyboard.isPressed('Space', 'Enter')) return state.modifyState('progress', x => x + 1);
      return state;
    }

    draw(state, action, counters, painter, game) {
      const OPERATIONS = [
        'source-over',
        'source-in',
        'source-out',
        'source-atop',
        'destination-over',
        'destination-in',
        'destination-out',
        'destination-atop',
        'lighter',
        'copy',
        'xor',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity'
      ];
      if (state.getState('progress') === 0) {
        painter.clear();

        OPERATIONS.forEach((op, i) => {
          const cellX = (i % 6) * 100;
          const cellY = Math.floor(i / 6) * 120;
          painter.roundRect(cellX + 10, cellY + 10, 60, 60, 10).fill('#f66');
          painter.text(op, cellX + 50, cellY + 110, { size: 12, align: 'center', baseline: 'middle' }).fill('#fff');
        });
        painter.setGlobalAlphaAndDraw((1 + Math.cos(KoturnoUtil.toRadians(counters.scene))) / 2, () => {
          OPERATIONS.forEach((op, i) => {
            const cellX = (i % 6) * 100;
            const cellY = Math.floor(i / 6) * 120;
            painter.rect(cellX, cellY, 100, 100).clipAndDraw(() => {
              painter.setGlobalCompositeOperationAndDraw(op, () => {
                painter.roundRect(cellX + 30, cellY + 30, 60, 60, 10).fill('#33f');
              });
            });
          });
        });
      } else {
        painter.clear();

        painter.rect(0, 50, 600, 50).fill('#000');
        painter.rect(250, 450, 100, 100).fill('#000');
        painter.scaleAndDraw(150, 500, 0.66, 0.66, () => {
          painter.rect(100, 450, 100, 100).fill('#000');
        });
        painter.scaleAndDraw(450, 500, 1.5, 1.5, () => {
          painter.rect(400, 450, 100, 100).fill('#000');
        });
        painter.rotateAndDraw(game.width / 2, game.height / 2, KoturnoUtil.toRadians(counters.scene), () => {
          painter.text('Q', game.width / 2, game.height / 2, { size: 84, align: 'center', baseline: 'middle' }).fill('#000');
        });
        painter.setGlobalCompositeOperationAndDraw('source-atop', () => {
          painter.background(painter.createPattern('pattern'));
        });
        painter.setGlobalCompositeOperationAndDraw('destination-over', () => {
          painter.background('#000');
        });
        painter.setGlobalAlphaAndDraw(0.4, () => {
          painter.rect(100, 450, 100, 100).fill('#f00');
          painter.rect(400, 450, 100, 100).fill('#f00');
        });
      }
    }

    transition(state, action, counters, game) {
      return state.getState('progress') >= 2 ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const ActionTestScene0 = class extends Scene {
    constructor() {
      super('ActionManager-0');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      painter.background('#fff');

      painter.text(Array.from(action.keyboard.down.values()).join('\n'), game.width / 4, 28, { align: 'center', baseline: 'middle', size: 28, lineHeight: '100%' }).fill("#333");
      painter.text(Array.from(action.keyboard.pressed.values()).join('\n'), game.width * 3 / 4, 28).fill("#333");
    }

    transition(state, action, counters, game) {
      return action.mouse.isPressed(MouseButton.LEFT, MouseButton.RIGHT, MouseButton.MIDDLE) ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const ActionTestScene1 = class extends Scene {
    constructor() {
      super('ActionManager-1');
    }

    init(state, counters, game) {
      return State.init({});
    }

    draw(state, action, counters, painter, game) {
      painter.background('#fff');

      if (action.mouse.isOverTarget())
        painter.rect(game.width / 4, game.height / 4, game.width / 2, game.width / 2).fill('#cfc');
      if (action.mouse.isDown(MouseButton.LEFT))
        painter.rect(0, 0, game.width / 2, game.height).fill('#fcc');
      if (action.mouse.isPressed(MouseButton.LEFT))
        painter.rect(game.width / 2, 0, game.width / 2, game.height).fill('#ccf');
      painter.text(action.mouse.toString(), game.width / 2, game.height / 2, { size: 32, align: 'center', baseline: 'middle' }).fill('#333');
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const SoundTestScene0 = class extends Scene {
    constructor() {
      super('SoundManager-0');
    }

    init(state, counters, game) {
      return State.init({});
    }

    update(state, action, counters, sound, game) {
      if (action.keyboard.isPressed('KeyS')) sound.playSE('move');
      if (action.keyboard.isPressed('KeyG')) sound.playSE('se1');
      if (action.keyboard.isPressed('KeyK')) sound.playSE('se2');
      return state;
    }

    draw(state, action, counters, painter, game) {
      painter.background('#fff');
    }

    transition(state, action, counters, game) {
      return action.keyboard.isPressed('Space', 'Enter') ? Transition.Trans('title') : Transition.Stay();
    }
  };

  const scenes = new Scenes([
    new TitleScene(),
    new PainterTestScene0(),
    new PainterTestScene1(),
    new PainterTestScene2(),
    new PainterTestScene3(),
    new PainterTestScene4(),
    new PainterTestScene5(),
    new PainterTestScene6(),
    new PainterTestScene7(),
    new PainterTestScene8(),
    new PainterTestScene9(),
    new ActionTestScene0(),
    new ActionTestScene1(),
    new SoundTestScene0(),
  ]);

  Logger.setLogLevel(LogLevel.DEBUG);
  new Game({
    scenes,
    firstScene: 'title',
    images: [
      { name: 'box', src: 'img/box.png' },
      { name: 'box-sprite', src: 'img/box.png', sprite: { width: 32, height: 32 } },
      { name: 'pattern', src: 'img/pattern.png' }
    ],
    sounds: [
      { name: 'move', src: 'sound/cursor_move_2.ogg', type: SoundType.SE },
      { name: 'se1', src: 'sound/se01a.wav', type: SoundType.SE },
      { name: 'se2', src: 'sound/se02a.mp3', type: SoundType.SE },
      { name: 'theme', src: 'sound/reversible_world.ogg', type: SoundType.BGM }
    ]
  }).center().run();
})();
