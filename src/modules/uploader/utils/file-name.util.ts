export class FileNameUtil {
  private output: string;

  constructor(private readonly name: string) {
    this.output = this.name;
  }

  removeExt() {
    this.output = this.output.replace(/\.[^/.]+$/, '');

    return this;
  }

  normalize() {
    this.output = this.output
      .replace(/[^\w\s\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff-_]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    return this;
  }

  get filename() {
    return this.output;
  }
}
