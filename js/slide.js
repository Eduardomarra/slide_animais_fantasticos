export default class slide{
  constructor(slide, slideWrapper){
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper); 
  }

  onStart(event){
    event.preventDefault();
    this.slideWrapper.addEventListener("mousemove", this.onMove)

  }

  onMove(event){

  }

  onEnd(event){
    this.slideWrapper.removeEventListener("mousemove", this.onMove)
  }

  addSlideEvents(){
    this.slideWrapper.addEventListener("mousedown", this.onStart)
    this.slideWrapper.addEventListener("mouseup", this.onEnd)
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  init(){
    this.bindEvents();
    this.addSlideEvents();
    return this;
  }
}