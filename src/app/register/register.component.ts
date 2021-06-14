import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string | undefined;
  surname: string | undefined;
  region: string | undefined;
  number: number | undefined;
  email: string | undefined;
  terms: boolean | undefined;
  hear: boolean | undefined;



  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.name, this.surname, this.region, this.number, this.email, this.terms, this.hear);
    if (this.name != 'undefined' && this.surname != 'undefined' && this.region != 'undefined' && this.number != null && this.email != '' && this.terms === true) {
      // @ts-ignore
      let user = {
        first_name: this.name!,
        last_name: this.surname,
        province: this.region,
        cell: this.number,
        email_address: this.email,
        opt_in: this.hear
      }
      localStorage.setItem('user', JSON.stringify(user))
      this.router.navigate(['/select'])
    }
  }
}
