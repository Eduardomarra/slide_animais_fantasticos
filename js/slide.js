import debounce from "./debounce.js"

export default class slide{
  constructor(slide, slideWrapper){
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper); 
    this.distancia = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
    this.activeClass = 'active';
  }

  transitionSlide(active){
    this.slide.style.transition = active ? "transform .3s" : "";
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
    this.slideWrapper.addEventListener(movetype, this.onMove);
    this.transitionSlide(false);
  }

  onMove(event){
    const pointerPosition = (event.type === "mousemove") ? event.clientX : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event){
    const movetype = (event.type === "mouseup") ? "mousemove" : "touchmove";
    this.slideWrapper.removeEventListener(movetype, this.onMove);
    this.distancia.finalPosition = this.distancia.movePosition;
    this.transitionSlide(true);
    this.changeSlideOnEnd();
  }

  addSlideEvents(){
    this.slideWrapper.addEventListener("mousedown", this.onStart)
    this.slideWrapper.addEventListener("touchstart", this.onStart)
    this.slideWrapper.addEventListener("mouseup", this.onEnd)
    this.slideWrapper.addEventListener("touchend", this.onEnd)
  }

  // Slide Config

  slidePosition(slide){
    const margin = (this.slideWrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slideConfig(){
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element
      }
    });
  }

  slideIndexNav(index){
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  changeSlide(index){
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.distancia.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass(){
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  // Ativar navegacao next-prev

  activePrevSlide(){
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide(){
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  changeSlideOnEnd(){
    if (this.distancia.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    }  else if (this.distancia.movement < -120 && this.index.prev !== undefined){
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active)
    }
  }

  onResize(){
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active);
    }, 1000)
  }

  addResizeEvent(){
    window.addEventListener("resize", this.onResize);
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init(){
    this.bindEvents();
    this.transitionSlide(true);
    this.addSlideEvents();
    this.slideConfig();
    this.addResizeEvent();
    return this;
  }
}