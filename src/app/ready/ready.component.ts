import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActionSheetController, LoadingController, Platform, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Cloudinary} from "@cloudinary/angular-5.x";
import {Observable, Subject} from "rxjs";
import {WebcamImage, WebcamInitError, WebcamUtil} from "ngx-webcam";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.scss']
})
export class ReadyComponent implements OnInit {
  IMAGEPATH: any;
  colorEffect = 'none';
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  images = [];
  overlay: any;
  bgImage: string | null = 'carling_a8vafw';
  renderTransformed = false;
  imageName = new Date().valueOf().toString();
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  bg = "";
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  deviceId = '';
  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 1020},
    height: {ideal: 1920},
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | undefined;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  ready = false;
  count: number = 6

  constructor(public platform: Platform,
              public router: Router, private http: HttpClient,
              private actionSheetController: ActionSheetController, private toastController: ToastController, private plt: Platform, private loadingController: LoadingController, private cloudinary: Cloudinary,
              private ref: ChangeDetectorRef, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bgImage = params.get('set');
      this.bg = `https://res.cloudinary.com/${this.cloudinary.config().cloud_name}/image/upload/${this.bgImage}_BG.png`
      console.log(this.bgImage);
    });
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        console.log(mediaDevices)
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }


  countDown() {
    console.log("START")
    let intervalId = setInterval(() => {
      this.count = this.count - 1;
      console.log(this.count)
      if (this.count === 0) {
        this.triggerSnapshot()
        clearInterval(intervalId)
      }
    }, 1000)
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    const imageBlob = this.dataURItoBlob(this.webcamImage.imageAsBase64);
    const formData = new FormData();
    formData.append('file', imageBlob, this.imageName + '.png');
    formData.append('public_id', this.imageName);
    formData.append('upload_preset', this.cloudinary.config().bgremoval);
    formData.append('tags[]', 'person');
    this.uploadImageData(formData).then(r => {
      console.log(r);
    }).catch(err => {
      console.log(err);
    });
  }

  async uploadImageData(formData: FormData) {
    this.renderTransformed = false;
    this.overlay = null;
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();
    this.showWebcam = false;
    this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`, formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((res: any) => {
        if (res.created_at !== undefined) {
          this.renderTransformed = true;
          this.overlay = res.public_id;
          this.ref.detectChanges();
          this.router.navigate([`/image-render/${this.bgImage}/${this.overlay}`]);
        } else {
        }
      });
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI as unknown as string);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/png'});
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
