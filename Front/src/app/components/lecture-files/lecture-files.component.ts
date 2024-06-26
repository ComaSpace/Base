import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../file.service';

@Component({
  selector: 'app-lecture-files',
  templateUrl: './lecture-files.component.html',
  styleUrls: ['./lecture-files.component.css']
})
export class LectureFilesComponent implements OnInit {
  lectureId: string | undefined;
  files: any[] = [];

  constructor(private route: ActivatedRoute, private fileService: FileService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.lectureId = id !== null ? id : undefined;

    if (this.lectureId) {
      this.loadFiles();
    } else {
      console.error('Lecture ID is not defined');
      
    }
  }

  loadFiles(): void {
    if (this.lectureId) {
      this.fileService.getFiles(this.lectureId).subscribe((data: any[]) => {
        this.files = data;
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file: File = input.files[0];
      if (file && this.lectureId) {
        this.fileService.uploadFile(file, this.lectureId).subscribe(() => {
          this.loadFiles();
        });
      } else {
        console.error('Lecture ID is not defined');
       
      }
    } else {
      console.error('No file selected or input is invalid');
      
    }
  }

  onDeleteFile(fileId: string): void {
    
  }

  onToggleVisibility(fileId: string, visible: boolean): void {
    
  }
}
