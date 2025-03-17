class CrawlQueue {
  constructor(maxDepth) {
    this.queue = [];
    this.visited = new Set();
    this.maxDepth = maxDepth;
  }

  add(url, depth) {
    if (!this.visited.has(url) && depth <= this.maxDepth) {
      this.queue.push({ url, depth });
      this.visited.add(url);
    }
  }

  next() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

module.exports = { CrawlQueue };
