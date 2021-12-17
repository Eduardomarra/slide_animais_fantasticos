export default class slide{
  constructor(slide, slideWrapper){
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper); 
    this.distancia = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
  }

  moveSlide(distX){
    this.distancia.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0px, 0px)`
  }

  updatePosition(clientX){
    this.distancia.movement = (this.distancia.startX - clientX) * 1.6;
    return this.distancia.finalPosition - this.distancia.movement;
  }

  onStart(event){
    event.preventDefault();
    this.distancia.startX = event.clientX;
    this.slideWrapper.addEventListener("mousemove", this.onMove)

  }

  onMove(event){
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  onEnd(event){
    this.slideWrapper.removeEventListener("mousemove", this.onMove);
    this.distancia.finalPosition = this.distancia.movePosition;
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