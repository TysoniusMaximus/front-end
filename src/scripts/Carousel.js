export class Carousel {
  constructor(carousel, interval, speed) {
    this.carousel = carousel;
    this.dom = {
      track: '.js-track',
      slide: '.js-slide',
      button: '.js-button'
    }
    this.track = carousel.querySelector(this.dom.track);
    this.interval = interval;
    this.speed = speed;
    this.buildDots();
    this.cloneSlides();
    this.setTrack();
    this.startCarousel();
    this.bindUIActions();
    this.resetTrackHandler = this.resetTrack.bind(this);
  }

  buildDots() {
    // Build Dots HTML from precloned slides
    // append to Carousel
  }

  cloneSlides() {
    const slides = this.track.querySelectorAll(this.dom.slide);
    const first = slides[0];
    const last = slides[slides.length - 1];
    const newLast = first.cloneNode(true);
    const newFirst = last.cloneNode(true);
    first.classList.add('active');
    newLast.classList.add('clone');
    newFirst.classList.add('clone');
    this.track.append(newLast);
    this.track.prepend(newFirst);
  }

  setTrack() {
    const slides = this.track.querySelectorAll(this.dom.slide);
    const width = 100 * slides.length;
    this.track.style.width = `${width}vw`;
    this.track.style.transform = 'translateX(-100vw)';
    this.track.style.transitionDuration = `${this.speed}ms`;
  };

  startCarousel() {
    this.activeInterval = setInterval(() => {
      this.changeSlide('next');
    }, this.interval);
  }

  changeSlide(direction) {
    if (this.track.classList.contains('animating')) {
      return;
    }
    this.track.classList.add('animating');
    const active = this.track.querySelector(`${this.dom.slide}.active`);
    const slides = [...this.track.children];
    const index = slides.indexOf(active);
    let position = -100 * index;
    let reset = false;
    let nextSlide;
    if (direction === 'next') {
      position = position - 100;
      if (index + 1 >= slides.length - 1) {
        nextSlide = slides[1];
        reset = true;
      } else {
        nextSlide = slides[index + 1];
      }
    } else {
      position = position + 100;
      if (index - 1 <= 0) {
        nextSlide = slides[slides.length - 2];
        reset = true;
      } else {
        nextSlide = slides[index - 1];
      }
    }
    active.classList.remove('active');
    nextSlide.classList.add('active');
    this.track.style.transform = `translateX(${position}vw)`;
    this.track.addEventListener('transitionend', this.removeStatus.bind(this));
  
    if (reset) {
      this.track.addEventListener('transitionend', this.resetTrackHandler);
    }
  }

  removeStatus() {
    this.track.classList.remove('animating');
  }

  resetTrack() {
    const slides = [...this.track.children];
    const duration = this.track.style.transitionDuration;
    const active = this.track.querySelector('.active');
    const index = slides.indexOf(active);
    this.track.style.transitionDuration = '';
    if (index === 1) {
      this.track.style.transform = 'translateX(-100vw)';
    } else {
      const value = -100 * (slides.length - 2);
      this.track.style.transform = `translateX(${value}vw)`;
    }
    setTimeout(() => {
      this.track.style.transitionDuration = duration;
    }, 1);
    this.track.removeEventListener('transitionend', this.resetTrackHandler);
  }

  buttonHandler() {
    clearInterval(this.activeInterval);
    const direction = event.currentTarget.getAttribute('data-direction');
    this.changeSlide(direction);
    this.startCarousel();
  }

  bindUIActions() {
    this.carousel.querySelectorAll(this.dom.button).forEach((button) => {
      button.addEventListener('click', this.buttonHandler.bind(this));
    });
  }
}