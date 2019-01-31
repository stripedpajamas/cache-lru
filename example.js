const Cache = require('.')

const cache = new Cache(5) // max 5 items in cache

// a simple db class stub
class DB {
  constructor () {
    this.data = {
      pete: 'foo',
      kev: 'bar',
      joel: 'ants',
      bob: 'drax',
      dillon: 'rice',
      alice: 'beans',
      eve: 'wax',
      jon: 'wim'
    }
  }
  get (key) {
    return this.data[key]
  }
}

const db = new DB()

// client requests pete
// first we try cache, updating on miss
function getData (key) {
  let val = cache.get(key) // null
  let suffix = '(from cache)'
  if (val === null) {
    // get from DB and populate cache
    val = db.get(key)
    cache.set(key, val)
    suffix = '(from db)'
  }
  // return val to client
  console.log(`data: ${key} => ${val}\t${suffix}`)
}

function printCacheEntries (cache) {
  console.log('\nCache entries from least recently accessed to most recently accessed:')
  let current = cache.head
  while (current) {
    console.log(current.data)
    current = current.next
  }
  console.log('')
}

getData('pete') // miss, adds to cache
getData('kev') // miss, adds to cache
getData('joel') // miss, adds to cache
getData('dillon') // miss, adds to cache
getData('pete') // hit, becomes most recent
getData('dillon') // hit, becomes most recent
getData('kev') // hit, becomes most recent
getData('bob') // miss, adds to cache (cache is now full)
// cache should have [joel, pete, dillon, kev, bob]
// so next miss will kick joel out
printCacheEntries(cache)
getData('alice') // miss, adds to cache, kicks out joel
printCacheEntries(cache)

