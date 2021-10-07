module.exports = {
    Queue
  }

class Queue {
   constructor(){
      this.elements = []
   }

   enqueue(item){
      this.elements.push(item)
   }

   dequeue(item){
      if(this.isEmpty()){
         return null
      }
      return this.elements.shift(item)
   }

   isEmpty(){
      return this.elements.length === 0
   }

   peek(){
      return !this.isEmpty() ? this.elements[0] : undefined
   }

   length(){
      return this.elements.length
   }
}