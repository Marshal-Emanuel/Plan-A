import {Component,OnInit,OnDestroy,ElementRef,Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Dropzone from 'dropzone';
import { FileToUmageUrlPipe } from '../../pipes/file-to-umage-url.pipe';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileToUmageUrlPipe
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  @Output() cancelEvent = new EventEmitter<void>();

  eventName: string = '';
  eventType: string = '';
  location: string = '';
  eventDate: string = '';
  price: number | null = null;
  numberOfTickets: number | null = null;
  additionalInfo: string = '';


  dropzone!: Dropzone;
  files: File[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initializeDropzone();
  }

  ngOnDestroy(): void {
    if (this.dropzone) {
      this.dropzone.destroy();
    }
  }

  private initializeDropzone(): void {
    this.dropzone = new Dropzone(
      this.elementRef.nativeElement.querySelector('.dropzone'),
      {
        url: '/upload', // This won't be used
        autoProcessQueue: false,
        addRemoveLinks: true,
      }
    );

    this.dropzone.on('addedfile', (file: File) => {
      this.files.push(file);
    });

    this.dropzone.on('removedfile', (file: File) => {
      const index = this.files.indexOf(file);
      if (index !== -1) {
        this.files.splice(index, 1);
      }
    });
  }

  onSubmit(): void {
    const eventData = {
      eventName: this.eventName,
      eventType: this.eventType,
      location: this.location,
      eventDate: this.eventDate,
      price: this.price,
      numberOfTickets: this.numberOfTickets,
      additionalInfo: this.additionalInfo,
      files: this.files.map(file => file.name)
    };

    console.log('Event Data:', eventData);

  }

  onCancel(): void {
    this.cancelEvent.emit();
  }
}
