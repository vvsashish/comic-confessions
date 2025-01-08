class CustomStorage {
  constructor() {
    this.storage = {};
  }

  setItem(key, value) {
    this.storage[key] = JSON.stringify(value);
  }

  getItem(key) {
    return this.storage.hasOwnProperty(key)
      ? JSON.parse(this.storage[key])
      : null;
  }

  removeItem(key) {
    if (this.storage.hasOwnProperty(key)) {
      delete this.storage[key];
    }
  }

  clear() {
    this.storage = {};
  }

  getAllKeys() {
    return Object.keys(this.storage);
  }
}
