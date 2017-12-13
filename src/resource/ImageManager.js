/**
 * Copyright 2017 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import Logger from '../logger/Logger.js';

/**
 * Class for manageing images.
 * @param {Object[]} images image properties
 * @param {string} images[].name name of an image
 * @param {string} images[].src source path of an image
 * @param {Object} [images[].sprite] if the image is a sprite, then use this parameter
 * @param {number} [images[].sprite.width] sprite width
 * @param {number} [images[].sprite.height] sprite height
 */
export default class ImageManager {
  constructor(images) {
    if (images.every(image => ['name', 'src'].every(param => param in image))) {
      this.images = new Map();
      images.forEach(image => {
        this.images.set(image.name, {
          name: image.name,
          src: image.src,
          image: null,
          imageData: null,
          size: 'sprite' in image ? image.sprite : null
        });
      });
    } else {
      Logger.fatal("ImageManager requires image properties of 'name' and 'src'");
    }
  }

  /**
   * Load images.
   * @returns {Promise}
   */
  load() {
    return Promise.all(Array.from(this.images.values()).map(imageProp => new Promise((res, rej) => {
      if (imageProp.image === null) {
        imageProp.image = new Image();
        imageProp.image.onload = e => {
          if (imageProp.size === null) imageProp.size = { width: imageProp.image.width, height: imageProp.image.height };
          const cv = document.createElement('canvas');
          const ctx = cv.getContext('2d');
          [cv.width, cv.height] = [imageProp.image.width, imageProp.image.height];
          ctx.drawImage(imageProp.image, 0, 0);
          imageProp.imageData = ctx.getImageData(0, 0, cv.width, cv.height);
          res(null);
        };
        imageProp.image.onerror = e => {
          rej(null);
        };
        imageProp.image.src = imageProp.src;
      } else {
        res(null);
      }
    })));
  }

  /**
   * Get an image.
   * @param {string} name image name
   * @returns {?Image} the image
   */
  getImage(name) {
    if (this.images.has(name)) {
      return this.images.get(name).image;
    } else {
      Logger.fatal(`ImageManager has no image of name ${name}. Please preload before use.`);
      return null;
    }
  }

  /**
   * Get image properties.
   * @param {string} name image name
   * @returns {?Object} the image properties
   */
  getImageProperties(name) {
    if (this.images.has(name)) {
      return this.images.get(name);
    } else {
      Logger.fatal(`ImageManager has no image of name ${name}. Please preload before use.`);
      return null;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[ImageManager ${this.images.size}]`;
  }
}
