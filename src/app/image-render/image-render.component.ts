import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-image-render',
  templateUrl: './image-render.component.html',
  styleUrls: ['./image-render.component.scss']
})
export class ImageRenderComponent implements OnInit {
  background: string = '';
  overlay: string | null | undefined;
  delay = false;
  canRender = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.background = params.get('background')!;
      this.overlay = params.get('overlay');
      console.log(this.background);
      console.log(this.overlay);
      this.canRender = true;
    });
    setTimeout(() => {
      this.delay = true;
    }, 5000);
  }


}
