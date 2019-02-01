const ListNode = require('./ListNode')

/**
 * A cache with LRU invalidation scheme
 */
class Cache {
  constructor (capacity) {
    this.capacity = capacity
    this.size = 0
    this.head = null
    this.tail = null
    this.map = new Map()
  }
  get (key) {
    if (!this.map.has(key)) return null
    
    // update the node to be the tail
    const node = this.map.get(key)
    this._setMostRecent(node)
    return node.data.val
  }
  set (key, val) {
    const node = new ListNode({ key, val })
    if (!this.head) {
      this.head = node
    }
    this.map.set(key, node)
    this._setMostRecent(node)
    this.size++
    if (this.size > this.capacity) {
      this._removeLeastRecent()
    }
  }
  _removeLeastRecent () {
    if (!this.head) return
    
    // chop off the head
    this.map.delete(this.head.data.key)
    this.head = this.head.next
    if (this.head) {
      this.head.prev = null
    }
    this.size--
  }
  _setMostRecent (node) {
    // set this node to be the tail of the internal list
    const prev = node.prev
    const next = node.next
    if (prev) {
      prev.next = next
    }
    if (this.head === node && this.head.next) {
      this.head = this.head.next
      if (this.head) {
        this.head.prev = null
      }
    }
    if (this.tail) {
      this.tail.next = node
    }
    node.prev = this.tail
    this.tail = node
    node.next = null
  }
}

module.exports = Cache
