/**
 * mvvm for google map
 */
class GoogleMapMvvm {
  constructor(conf, map) {
    this.$conf = {
      methods: {},
      ready: function(){},
      items: [],
      ...conf,
    }

    this.$map = map
    this.$items = []
    this.$parseMethods()
    this.$setItems(this.$conf.items)
    this.$conf.ready.call(this)
  }

  $parseMethods() {
    for (let i in this.$conf.methods) {
      this[i] = this.$conf.methods[i]
      this[i].bind(this)
    }
  }

  $setItems(items) {
    //to delete
    const toRemoves = this.$items.filter(x => !items.includes(x))
    toRemoves.forEach((x) => {
      this.$$_removeItem(x)
    })

    //to add
    const toAdds = items.filter(x => !this.$items.includes(x))
    toAdds.forEach((x) => {
      this.$$_addItem(x)
    })

    this.$items = items.concat()
  }

  $updateItem(i, item) {
    this.$$_removeItem(this.$items[i])
    this.$$_addItem(item)
    this.$items = this.$items.concat()
    this.$items[i] = item
  }

  $addItem(item) {
    this.$$_addItem(item)
    this.$items = this.items.concat([item])
  }

  $removeItem(item) {
    const i = this.$items.indexOf(item)
    if(i < 0){
      console.log(`remove an item not in map items`,{
        item,
        items: this.$items,
      })
      return
    }
    this.$$_removeItem(this.$items[i])
    this.$items.splice(i, 1)
    this.$items = this.$items.concat()
  }

  $$_addItem(item) {
    item.$ref = new item.Constructor(item.data)
    item.$vm = this
    if (item.listeners) {
      for (let i in item.listeners) {
        item.$ref.addListener(i, item.listeners[i].bind(item))
      }
    }

    item.$ref.setMap(this.$map)
  }

  $$_removeItem(item) {
    item.$ref.setMap(null)
  }
}

export default GoogleMapMvvm