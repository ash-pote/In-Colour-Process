class Effects {
  static counter = 0;
}

class FilmGrainEffect {
  static counter = 0;
  static index = 0;

  constructor(x, y, w, h, patternSize, sampleSize = 1, patternAlpha = 0.1) {
    this.id = "FilmGrain_" + Effects.counter++;
    this.reset(x, y, w, h, patternSize, sampleSize, patternAlpha);
  }

  reset(x, y, w, h, patternSize, sampleSize = 1, patternAlpha = 0.1) {
    this.samples = [];
    this.currentSampleSet = [];
    this.patternRefreshInterval = 4;
    FilmGrainEffect.counter = 0;
    FilmGrainEffect.index = 0;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.p = patternSize;
    this.s = sampleSize;
    this.a = map(patternAlpha, 0, 1, 0, 255);
    for (let i = 0; i < sampleSize; i++) {
      this.samples.push(
        this.pattern(this.x, this.y, this.w, this.h, this.p, this.a)
      );
    }
  }

  add(effect) {}

  pattern(x, y, w, h, patternSize, patternAlpha) {
    // luodaan uusi p5 canvas || create new p5 canvas
    let pg = createGraphics(patternSize, patternSize);
    pg.pixelDensity(1);

    // luodaan kohina | create noise
    pg.loadPixels();
    for (var _y = 0; _y < patternSize; _y += 1) {
      for (var _x = 0; _x < patternSize; _x += 1) {
        let i = (_x + _y * patternSize) * 4;
        let value = (Math.random() * 255) | 0;
        pg.pixels[i] = value;
        pg.pixels[i + 1] = value;
        pg.pixels[i + 2] = value;
        pg.pixels[i + 3] = patternAlpha;
      }
    }
    pg.updatePixels();

    // lasketaan kohinapalojen paikat ja tallennetaan ne | calculate position of noise pieces and save them
    let xlen = w / patternSize;
    let ylen = h / patternSize;

    let samples = [];
    for (let i = 0; i < ylen; i++) {
      for (let j = 0; j < xlen; j++) {
        let _x = x + patternSize * j;
        let _y = y + patternSize * i;
        samples.push({
          canvas: pg,
          x: _x,
          y: _y,
          w: patternSize,
          h: patternSize,
        });
      }
    }

    return samples;
  }

  update(data) {
    if (FilmGrainEffect.counter++ === this.patternRefreshInterval) {
      FilmGrainEffect.counter = 0;
      FilmGrainEffect.index++;
      if (!this.samples[FilmGrainEffect.index]) {
        FilmGrainEffect.index = 0;
      }
    }
    this.currentSampleSet = this.samples[FilmGrainEffect.index];
  }

  display() {
    for (let sample of this.currentSampleSet) {
      image(sample.canvas, sample.x, sample.y, sample.w, sample.h);
    }
  }

  [Symbol.iterator]() {
    return this.currentSampleSet;
  }
}
