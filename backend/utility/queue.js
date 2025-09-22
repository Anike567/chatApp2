class Queue {
  constructor() {
    this.arr = [];
    this.front = 0;
  }

  isEmpty() {
    return this.front >= this.arr.length;
  }

  push(data) {
    this.arr.push(data);
  }

  pop() {
    if (this.isEmpty()) return null;
    const msg = this.arr[this.front];
    this.front += 1;

    if (this.front > 50 && this.front * 2 > this.arr.length) {
      this.arr = this.arr.slice(this.front);
      this.front = 0;
    }

    return msg;
  }

  size() {
    return this.arr.length - this.front;
  }
}


module.exports = Queue;