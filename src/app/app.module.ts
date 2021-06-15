import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {IonicModule} from '@ionic/angular';
import {RegisterComponent} from './register/register.component';
import {SelectComponent} from './select/select.component';
import {SelectPlayersComponent} from './select-players/select-players.component';
import {SwiperModule} from "swiper/angular";
import {ReadyComponent} from './ready/ready.component';
import {CloudinaryConfiguration, CloudinaryModule} from "@cloudinary/angular-5.x";
import {HttpClientModule} from "@angular/common/http";
import {Cloudinary} from "cloudinary-core";
import {WebcamModule} from "ngx-webcam";
import {FormsModule} from "@angular/forms";
import { ImageRenderComponent } from './image-render/image-render.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    SelectComponent,
    SelectPlayersComponent,
    ReadyComponent,
    ImageRenderComponent
  ],
  imports: [
    BrowserModule, SwiperModule,
    AppRoutingModule, WebcamModule,
    BrowserAnimationsModule,
    MatSliderModule, HttpClientModule,
    IonicModule.forRoot(), CloudinaryModule.forRoot({Cloudinary}, {
      cloud_name: 'foneworx',
      upload_preset: 'nobgremoval',
      final_preset: 'bgremoval',
      bgremoval: 'nxccf4bn',
    } as CloudinaryConfiguration), FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
