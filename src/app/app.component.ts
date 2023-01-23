import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}

  public openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      maxWidth: '80vw',
      height: '500px',
      maxHeight: '80vh',
    });
  }
}
