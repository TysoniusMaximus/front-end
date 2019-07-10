import '../styles/main.scss';

import { Carousel } from './Carousel';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-carousel').forEach((carousel) => {
    new Carousel(carousel, 5000, 1000);
  })
});