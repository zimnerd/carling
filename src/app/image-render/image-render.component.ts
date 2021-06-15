import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {LoadingController} from "@ionic/angular";
import domtoimage from 'dom-to-image';
import {Cloudinary} from "@cloudinary/angular-5.x";

@Component({
  selector: 'app-image-render',
  templateUrl: './image-render.component.html',
  styleUrls: ['./image-render.component.scss']
})
export class ImageRenderComponent implements OnInit {
  @ViewChild('container') container: any;
  background: string = '';
  overlay: string | null | undefined;
  delay = false;
  canRender = false;
  user: {
    last_name: '',
    first_name: '',
    team_name: '',
    img_url: '',
    team_group: '',
  } | undefined;
  fullname = '';
  imageName = '';

  constructor(private route: ActivatedRoute, private cloudinary: Cloudinary, private http: HttpClient, private loadingController: LoadingController) {
  }

  ngOnInit(): void {

    this.presentLoading().then(_ => {
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
        if (typeof localStorage.getItem('team_name') === "string") {
          // @ts-ignore
          this.user.team_name = localStorage.getItem('team_name');
          // @ts-ignore
          this.user.team_group = localStorage.getItem('team_group');
          // @ts-ignore
          this.imageName = this.user.first_name.replace(/\s+/g, '-') + '-' + this.user.team_group + '-' + new Date().valueOf().toString();
        }

        console.log(this.user)
      }
      console.log(this.user);
    });
    setTimeout(() => {
      this.delay = true;
      this.uploadImageData();
    }, 10000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 6000
    });

    await loading.present();
  }


  async uploadImageData() {
    // @ts-ignore
    domtoimage.toBlob(document.getElementById('my-node'))
      .then(async (imageBlob: any) => {
        console.log(imageBlob)
        const formData = new FormData();
        formData.append('file', imageBlob, this.imageName + '.png');
        formData.append('public_id', this.imageName);
        formData.append('upload_preset', this.cloudinary.config().final_preset);
        formData.append('tags[]', 'people');
        this.overlay = null;
        const loading = await this.loadingController.create({
          message: 'Please wait...',
        });
        this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`, formData)
          .pipe(
            finalize(() => {
              loading.dismiss();
            })
          )
          .subscribe((res: any) => {
            if (res.created_at !== undefined) {
              this.upload(res.secure_url)
            } else {
            }
          });
      })

  }


  async upload(secure_url: any) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    // @ts-ignore
    this.user.img_url = secure_url;
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
  }


}
