import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';

const darkBgClassName = 'dark-bg';

@Injectable({
  providedIn: 'root'
})
export class BackgroundColorService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addGlobalStyle() {
    this.renderer.addClass(document.body, darkBgClassName);
  }

  removeGlobalStyle() {
    this.renderer.removeClass(document.body, darkBgClassName);
  }
}