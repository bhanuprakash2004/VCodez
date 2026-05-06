import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WaterService } from '../water';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.html'
})
export class FormComponent {

  data = { ph: 0, turbidity: 0, temperature: 0 };
  result:any;

  constructor(private service: WaterService){}

  submit(){
    this.service.addData(this.data).subscribe(res=>{
      this.result = res;
    });
  }
}
