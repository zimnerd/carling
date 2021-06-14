import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {LoadingController} from "@ionic/angular";

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
  user: {
    last_name: string;
    first_name: string;
    img_url: string
  } | undefined;
  fullname = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private loadingController: LoadingController) {
  }

  ngOnInit(): void {

    this.presentLoading().then(_ => {
      this.upload();
    });
    this.route.paramMap.subscribe(params => {
      this.background = params.get('background')!;
      this.overlay = params.get('overlay');
      console.log(this.background);
      console.log(this.overlay);
      this.canRender = true;
      let localUser: string | null = '';
      if (localStorage.getItem('user') != null) {
        localUser = localStorage.getItem('user')
      }
      if (typeof localUser === "string") {
        this.user = JSON.parse(localUser)
        this.fullname = this.user?.first_name + ' ' + this.user?.last_name
        // @ts-ignore
        this.user.img_url = "https://res.cloudinary.com/dnit13rfq/image/upload/e_multiply,l_" + this.overlay + "/" + this.background + ""
        console.log(this.user)
      }
      console.log(this.user);
    });
    setTimeout(() => {
      this.delay = true;
      this.upload();
    }, 5000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 6000
    });

    await loading.present();
  }

  async upload() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    setTimeout(async () => {
      await loading.present();
      this.http.post('https://cblapp.foneworx.co.za/submit_picture/', this.user)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe((res: any) => {
          console.log(res)
        });
    }, 5000);
  }


}
