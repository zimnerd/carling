import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IonSlides} from "@ionic/angular";

@Component({
  selector: 'app-select-players',
  templateUrl: './select-players.component.html',
  styleUrls: ['./select-players.component.scss']
})
export class SelectPlayersComponent implements OnInit {
  @ViewChild('playersSlider') playersSlider?: IonSlides;
  team: any;
  curentTeam: string[] = [];
  selectedPlayers: string[] = [];
  remaining = 4;
  set: any;

  slider: any;
  playerSlider = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true,
    spaceBetween: 20
  };
  players = {
    amakhosi: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    orlando: ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'Z']
  };
  playersSet: any;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.team = params.get('team');
      localStorage.setItem("team_name","Orlando Pirates");
      this.curentTeam = this.players.orlando;
      if (this.team === 'amakhosi') {
        this.curentTeam = this.players.amakhosi
        localStorage.setItem("team_name","Kaizer Chiefs")
      }
      console.log(this.team);
      console.log(this.curentTeam);
    });

  }

  togglePlayer(id: any) {
    console.log("CLICKED", id);
    if (this.selectedPlayers.indexOf(id) === -1 && this.remaining > 0) {
      this.selectedPlayers.push(id);
    } else {
      const index = this.selectedPlayers.indexOf(id);
      console.log("REMOVE", index);
      if (index > -1) {
        this.selectedPlayers.splice(index, 1);
      }
    }
    this.selectedPlayers.sort();
    console.log("SELCTED", this.selectedPlayers);
    this.remaining = 4 - this.selectedPlayers.length;
    if (this.remaining === 0) {
      this.set = this.selectedPlayers.join('');
      localStorage.setItem("team_group", this.set)
      console.log(this.set);
    }
  }

  slideNext(object: any, slideView: { slideNext: (arg0: number) => Promise<any>; }) {
    slideView.slideNext(500).then(() => {
    });
  }

  //Move to previous slide
  slidePrev(object: any, slideView: { slidePrev: (arg0: number) => Promise<any>; }) {
    slideView.slidePrev(500).then(() => {
    });
  }
}
