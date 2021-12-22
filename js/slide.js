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
    let movetype;
    if (event.type === "mousedown"){
      event.preventDefault();
      this.distancia.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.distancia.startX = event.changedTouches[0].clientX;
      movetype = "touchmove"
    }
    this.slideWrapper.addEventListener(movetype, this.onMove)
  }

  onEnd(event){
    const movetype = (event.type === "mouseup") ? "mousemove" : "touchmove";
    this.slideWrapper.removeEventListener(movetype, this.onMove);
    this.distancia.finalPosition = this.distancia.movePosition;
  }

  onMove(event){
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  addSlideEvents(){
    this.slideWrapper.addEventListener("mousedown", this.onStart)
    this.slideWrapper.addEventListener("touchstart", this.onStart)
    this.slideWrapper.addEventListener("mouseup", this.onEnd)
    this.slideWrapper.addEventListener("touchend", this.onEnd)
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