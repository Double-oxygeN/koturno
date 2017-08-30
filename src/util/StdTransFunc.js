/**
 * Namespace of standard transition functions.
 * @namespace
 */
const StdTransFunc = {
  /**
   * Transition to the next scene immediately.
   * @member {function}
   */
  cut: (prev, next, counter, painter) => {
    painter.image(prev, 0, 0);
    return true;
  },
  /**
   * Fade.
   * @param {number} duration duration of transition
   * @returns {function} transition function
   */
  fade: (duration) => (prev, next, counter, painter) => {
    painter.image(next, 0, 0);
    painter.setGlobalAlphaAndDraw(1 - counter / duration, () => {
      painter.image(prev, 0, 0);
    });
    return counter >= duration;
  },
  /**
   * Fade with color.
   * @param {number} duration duration of transition
   * @param {(string|CanvasGradient|CanvasPattern)} [style='#000'] fill style
   * @returns {function} transition function
   */
  fadeWithColor: (duration, style = '#000') => (prev, next, counter, painter) => {
    painter.image(counter * 2 < duration ? prev : next, 0, 0);
    painter.setGlobalAlphaAndDraw(counter * 2 < duration ? counter * 2 / duration : 2 - counter * 2 / duration, () => {
      painter.background(style);
    });
    return counter >= duration;
  },
  /**
   * Push the screen.
   * @param {number} duration duration of transition
   * @param {Directions} direction push direction
   * @param {function} [ease] easing function
   * @returns {function} transition function
   */
  push: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      painter.background('#000');
      painter.image(prev, horizontalRelativeDir * progress * prev.width, verticalRelativeDir * progress * prev.height);
      painter.image(next, horizontalRelativeDir * (progress - 1) * next.width, verticalRelativeDir * (progress - 1) * next.height);
      return counter >= duration;
    };
  },
  /**
   * Wipe the screen.
   * @param {number} duration duration of transition
   * @param {Directions} direction push direction
   * @param {function} [ease] easing function
   * @returns {function} transition function
   */
  wipe: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const x = horizontalRelativeDir < 0 ? (1 - progress) * next.width : 0;
      const y = verticalRelativeDir < 0 ? (1 - progress) * next.height : 0;
      painter.image(prev, 0, 0);
      painter.image(next, x, y, {
        crop: {
          x,
          y,
          width: horizontalRelativeDir ? progress * next.width : next.width,
          height: verticalRelativeDir ? progress * next.height : next.height
        }
      });
      return counter >= duration;
    };
  },
  /**
   * Split the screen and come in.
   * @param {number} duration duration of transition
   * @param {Directions} direction direction to come in
   * @param {Object} [opt] options
   * @param {number} [opt.num=8] number of splitting
   * @param {function} [opt.ease] easing function
   */
  stripeIn: (duration, direction, opt = {}) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    const barNum = 'num' in opt ? opt.num : 8;
    const ease = 'ease' in opt ? opt.ease : (x => x);
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const barWidth = horizontalRelativeDir ? next.width : next.width / barNum;
      const barHeight = verticalRelativeDir ? next.height : next.height / barNum;

      painter.image(prev, 0, 0);
      for (let i = 0, s = -1; i < barNum; i++, s *= -1) {
        const cx = horizontalRelativeDir ? 0 : i * barWidth;
        const cy = verticalRelativeDir ? 0 : i * barHeight;
        const x = horizontalRelativeDir ? s * horizontalRelativeDir * (1 - progress) * next.width : i * barWidth;
        const y = verticalRelativeDir ? s * verticalRelativeDir * (1 - progress) * next.height : i * barHeight;
        painter.image(next, x, y, { crop: { x: cx, y: cy, width: barWidth, height: barHeight } });
      }
      return counter >= duration;
    };
  },
  /**
   * Split the screen and go out.
   * @param {number} duration duration of transition
   * @param {Directions} direction direction to go out
   * @param {Object} [opt] options
   * @param {number} [opt.num=8] number of splitting
   * @param {function} [opt.ease] easing function
   */
  stripeOut: (duration, direction, opt = {}) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    const barNum = 'num' in opt ? opt.num : 8;
    const ease = 'ease' in opt ? opt.ease : (x => x);
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const barWidth = horizontalRelativeDir ? next.width : next.width / barNum;
      const barHeight = verticalRelativeDir ? next.height : next.height / barNum;

      painter.image(next, 0, 0);
      for (let i = 0, s = 1; i < barNum; i++, s *= -1) {
        const cx = horizontalRelativeDir ? 0 : i * barWidth;
        const cy = verticalRelativeDir ? 0 : i * barHeight;
        const x = horizontalRelativeDir ? s * horizontalRelativeDir * progress * next.width : i * barWidth;
        const y = verticalRelativeDir ? s * verticalRelativeDir * progress * next.height : i * barHeight;
        painter.image(prev, x, y, { crop: { x: cx, y: cy, width: barWidth, height: barHeight } });
      }
      return counter >= duration;
    };
  },
  /**
   *
   */
  silhouetteIn: (duration, focusX, focusY, draw) => {
    return (prev, next, counter, painter) => {
      const progress = counter / duration;
      const maxScale = Math.max(next.width, next.height);
      const scale = Math.pow(maxScale, -1 + 2 * progress);
      painter.clear();
      painter.scaleAndDraw(focusX, focusY, scale, scale, () => {
        draw(painter);
      });
      painter.setGlobalCompositeOperationAndDraw('source-in', () => {
        painter.image(next, 0, 0);
      });
      painter.setGlobalCompositeOperationAndDraw('destination-over', () => {
        painter.image(prev, 0, 0);
      });
      return counter >= duration;
    };
  },
  /**
   *
   */
  silhouetteOut: (duration, focusX, focusY, draw) => {
    return (prev, next, counter, painter) => {
      const progress = counter / duration;
      const maxScale = Math.max(next.width, next.height);
      const scale = Math.pow(maxScale, 1 - 2 * progress);
      painter.clear();
      painter.scaleAndDraw(focusX, focusY, scale, scale, () => {
        draw(painter);
      });
      painter.setGlobalCompositeOperationAndDraw('source-in', () => {
        painter.image(prev, 0, 0);
      });
      painter.setGlobalCompositeOperationAndDraw('destination-over', () => {
        painter.image(next, 0, 0);
      });
      return counter >= duration;
    };
  }
};

Object.freeze(StdTransFunc);
