export default class Entity<T> {
  attrs?: object

 constructor(attrs?: object) {
    if (attrs) {
      this.attrs = attrs
      Object.assign(this, attrs)
    }
  }

  toString(){
    if(this.attrs){
      for (let [key, value] of Object.entries(this.attrs)){
        console.log(`${key}: ${value}`)
      }
    }
  }
}