import { Component, OnInit, OnDestroy, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Dropzone from 'dropzone';
import { FileToUmageUrlPipe } from '../../pipes/file-to-umage-url.pipe';
import { EventsService } from '../../Services/events.service';
import { RouterLink } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileToUmageUrlPipe, 
    RouterLink, SuccessMessageComponent, ErrorMessageComponent
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, OnDestroy {
  @Input() eventId: string | undefined;
  @Output() cancelEvent = new EventEmitter<void>();
  eventName: string = '';
  eventType: string = '';
  location: string = '';
  eventDate: string = '';
  eventTime: string = '';
  numberOfTickets: number | null = null;
  hasRegular: boolean = false;
  regularPrice: number | null = 0;
  hasVIP: boolean = false;
  vipPrice: number | null = 0;
  hasChildren: boolean = false;
  childrenPrice: number | null = 0;
  isPromoted: boolean = false;
  promoDetails: string = '';
  description: string = '';
  moreInfo: string = '';
  image: string = ''; // Changed from array to single string
  files: File[] = [];
  dropzone!: Dropzone;
  today: string | number | Date | undefined;
  private router: any;
  managerId: string;

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';
  selectedEvent: null | undefined;
 
  
  constructor(private eventService: EventsService, private elementRef: ElementRef) {
    const userId = localStorage.getItem('userId');
    const cleanedUserId = userId ? userId.replace(/"/g, '') : '';
    this.managerId = cleanedUserId;
  }

  ngOnDestroy(): void {
    // Method implementation here if needed
  }

  ngOnInit(): void {
    this.initializeDropzone();
    if (this.eventId) {
      this.loadEventData();
    }
  }

  loadEventData() {
    if (!this.eventId) return;

    this.eventService.getEventById(this.eventId).subscribe(event => {
      this.eventName = event.name;
      this.eventType = event.eventType;
      this.location = event.location;
      this.eventDate = new Date(event.date).toISOString().split('T')[0]; // Format date
      this.eventTime = event.time;
      this.numberOfTickets = event.numberOfTickets;
      this.hasRegular = event.hasRegular;
      this.regularPrice = event.regularPrice;
      this.hasVIP = event.hasVIP;
      this.vipPrice = event.vipPrice;
      this.hasChildren = event.hasChildren;
      this.childrenPrice = event.childrenPrice;
      this.isPromoted = event.isPromoted;
      this.promoDetails = event.promoDetails;
      this.description = event.description;
      this.moreInfo = event.moreInfo;
      this.image = event.image;
    });
  }

  private initializeDropzone(): void {
    this.dropzone = new Dropzone(
      this.elementRef.nativeElement.querySelector('.dropzone'),
      {
        url: '/your-upload-endpoint', // This won't be used
        autoProcessQueue: false,
        addRemoveLinks: true,
      }
    );

    this.dropzone.on('addedfile', (file: File) => {
      this.files.push(file);
      this.readFile(file);
    });

    this.dropzone.on('removedfile', (file: File) => {
      this.files.splice(this.files.indexOf(file), 1);
      if (file.name === this.image) {
        this.image = '';
      }
    });
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shoppie'); // Your Cloudinary preset
    formData.append('cloud_name', 'dr0qq0taf'); // Your Cloudinary cloud name

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dr0qq0taf/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.url; // Return the URL of the uploaded image
  }

  onSubmit(form: NgForm): void {
    if (this.files.length > 0) {
      this.uploadFile(this.files[0])
        .then((uploadedFileUrl) => {
          const eventData = {
            name: this.eventName,
            eventType: this.eventType,
            location: this.location,
            date: new Date(this.eventDate),
            time: this.eventTime,
            numberOfTickets: this.numberOfTickets,
            hasRegular: this.hasRegular,
            regularPrice: this.regularPrice,
            hasVIP: this.hasVIP,
            vipPrice: this.vipPrice,
            hasChildren: this.hasChildren,
            childrenPrice: this.childrenPrice,
            isPromoted: this.isPromoted,
            promoDetails: this.promoDetails,
            description: this.description,
            moreInfo: this.moreInfo,
            image: uploadedFileUrl,
            managerId: this.managerId,
          };

          if (this.eventId) {
            this.updateEvent(eventData);
          } else {
            this.createEvent(eventData);
          }
        })
        .catch((error) => {
          console.error('Error uploading file', error);
        });
    } else {
      console.error('No files to upload');
    }
  }

  createEvent(eventData: any): void {
    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        console.log('Data sent to backend:', eventData);
        this.responseMessage = response.message;
        if (response.responseCode === 201) {
          console.log('Event response', response);
          this.responseMessage = response.message;
          this.resetAndShowMessage(true);
        } else {
          this.resetAndShowMessage(false);
        }
      },
      error: (error) => {
        console.error('Error creating event', error);
        this.responseMessage = 'Event creation failed. Please try again.';
        this.resetAndShowMessage(false);
      },
    });
  }

  updateEvent(eventData: any): void {
    this.eventService.updateEvent(this.eventId!, eventData).subscribe({
      next: (response) => {
        console.log('Event updated:', response);
        this.responseMessage = response.message;
        if (response.responseCode === 200) {
          this.resetAndShowMessage(true);
        } else {
          this.resetAndShowMessage(false);
        }
      },
      error: (error) => {
        console.error('Error updating event', error);
        this.responseMessage = 'Event update failed. Please try again.';
        this.resetAndShowMessage(false);
      },
    });
  }

  resetAndShowMessage(isSuccess: boolean) {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  
    setTimeout(() => {
      if (isSuccess) {
        this.showSuccessMessage = true;
      } else {
        this.showErrorMessage = true;
      }
    }, 10);
  }

  onEditEvent(eventId: string): void {
    console.log('Edit event received in parent:', eventId);
    this.eventId = eventId;
    this.selectedEvent = null;
  }



}
