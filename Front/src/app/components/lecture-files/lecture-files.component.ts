
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
  files: any[]; 

  constructor(private route: ActivatedRoute, private fileService: FileService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.lectureId = params['lectureId'];
      this.loadFiles();
    });
  }

  loadFiles(): void {
    // Call service to fetch files for current lectureId
    // Example: this.fileService.getFiles(this.lectureId).subscribe(files => this.files = files);
  }

  onFileSelected(event): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileService.uploadFile(file, this.lectureId).subscribe(() => {
        this.loadFiles();
      });
    }
  }

  onDeleteFile(fileId: string): void {
    this.fileService.deleteFile(fileId).subscribe(() => {
      this.loadFiles();
    });
  }

  onToggleVisibility(fileId: string, visibility: boolean): void {
    this.fileService.toggleFileVisibility(fileId, visibility).subscribe(() => {
      this.loadFiles();
    });
  }
}
