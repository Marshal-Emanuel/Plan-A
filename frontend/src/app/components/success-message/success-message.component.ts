import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessMessageComponent],
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.css'
})
export class SuccessMessageComponent {
  @Input() message: string = '';

}
