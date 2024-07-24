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
  selector: 'app-update-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileToUmageUrlPipe, 
    RouterLink,
    SuccessMessageComponent,
    ErrorMessageComponent
  ],
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.css'
})
export class UpdateEventComponent implements OnInit, OnDestroy {
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
  image: string = '';
  files: File[] = [];
  dropzone!: Dropzone;
  managerId: string;

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(private eventService: EventsService, private elementRef: ElementRef) {
    const userId = localStorage.getItem('userId');
    this.managerId = userId ? userId.replace(/"/g, '') : '';
  }

  ngOnInit(): void {
    this.initializeDropzone();
    if (this.eventId) {
      this.loadEventData();
    }
    console.log('Event ID:', this.eventId);
  }

  ngOnDestroy(): void {
    if (this.dropzone) {
      this.dropzone.destroy();
    }
  }

  loadEventData() {
    if (!this.eventId) return;
    

    this.eventService.getEventById(this.eventId).subscribe(event => {
      console.log('Event data:', event);
      this.eventName = event.name;
      this.eventType = event.eventType;
      this.location = event.location;
      if (event.date) {
        const dateObj = new Date(event.date);
        if (!isNaN(dateObj.getTime())) {
          this.eventDate = dateObj.toISOString().split('T')[0];
        } else {
          console.error('Invalid date received:', event.date);
          this.eventDate = ''; // Set to empty string or default value
        }
      }
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

      // If using Dropzone, you might want to display the existing image
      if (this.dropzone && this.image) {
        let mockFile = { name: 'Existing Image', size: 12345 };
        this.dropzone.emit('addedfile', mockFile);
        this.dropzone.emit('thumbnail', mockFile, this.image);
        this.dropzone.emit('complete', mockFile);
      }
    });
  }

  private initializeDropzone(): void {
    this.dropzone = new Dropzone(this.elementRef.nativeElement.querySelector('.dropzone'), {
      url: '/dummy-url',
      autoProcessQueue: false,
      addRemoveLinks: true,
      maxFiles: 1
    });

    this.dropzone.on('addedfile', (file: File) => {
      this.files = [file];
      this.readFile(file);
    });

    this.dropzone.on('removedfile', () => {
      this.files = [];
      this.image = '';
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
    formData.append('upload_preset', 'shoppie');
    formData.append('cloud_name', 'dr0qq0taf');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dr0qq0taf/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.url;
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

          this.updateEvent(eventData);
        })
        .catch((error) => {
          console.error('Error uploading file', error);
          this.responseMessage = 'Error uploading file. Please try again.';
          this.resetAndShowMessage(false);
        });
    } else {
      // If no new file is uploaded, use the existing image URL
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
        image: this.image,
        managerId: this.managerId,
      };

      this.updateEvent(eventData);
    }
  }

  updateEvent(eventData: any): void {
    if (!this.eventId) {
      console.error('Event ID is missing');
      return;
    }

    this.eventService.updateEvent(this.eventId, eventData).subscribe({
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

    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
      if (isSuccess) {
        this.cancelEvent.emit(); // Close the popup after successful update
      }
    }, 3000);
  }

  closePopup(): void {
    this.cancelEvent.emit();
  }
}