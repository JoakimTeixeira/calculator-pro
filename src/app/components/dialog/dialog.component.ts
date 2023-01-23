import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface InputValues {
  a: number | null;
  b: number | null;
  c: number | null;
}

interface InputErrors {
  [key: string]: {
    isRequired?: boolean;
    isNotMin?: boolean;
  };
}

@Component({
  selector: 'DialogComponent',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  standalone: true,
})
export class DialogComponent implements OnInit {
  public input: InputValues = { a: null, b: null, c: null };
  public formGroup: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.formGroup = this.getFormGroup();

    this.formGroup.valueChanges.subscribe(formValue => {
      this.input = { ...formValue };
    });

    this.formGroup.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        if (!this.formGroup.errors) {
          this.handleStatusErrors();
        }
      }
    });
  }

  private getFormGroup(): FormGroup {
    return new FormGroup({
      a: new FormControl(this.input.a, [
        Validators.required,
        Validators.min(1),
        Validators.max(Number.MAX_SAFE_INTEGER),
        Validators.pattern(/^\d+$/),
      ]),
      b: new FormControl(this.input.b, [
        Validators.min(1),
        Validators.max(Number.MAX_SAFE_INTEGER),
        Validators.pattern(/^\d+$/),
      ]),
      c: new FormControl(this.input.c, [
        Validators.min(1),
        Validators.max(Number.MAX_SAFE_INTEGER),
        Validators.pattern(/^\d+$/),
      ]),
    });
  }

  public save(): void {
    if (this.formGroup.valid) {
      const { a, b, c } = Object(this.input);

      try {
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
          throw new Error('Value is not a number');
        }

        const modifiedInput = {
          a: a ? Number(a) : 0,
          b: b ? Number(b) : 0,
          c: c ? Number(c) : 1,
        };

        if (
          c &&
          (modifiedInput.a + modifiedInput.b) % modifiedInput.c === 0 &&
          (modifiedInput.a + modifiedInput.b) / modifiedInput.c <= 1
        ) {
          throw new Error('Division cannot be 0');
        }

        const result = (modifiedInput.a + modifiedInput.b) / modifiedInput.c;

        if (!isFinite(result)) {
          throw new Error('Result is infinite');
        }

        const formattedResult = Number.isInteger(result)
          ? result
          : result.toFixed(2);

        if (formattedResult === '0.00') {
          throw new Error('The division result has too many zero digits');
        }

        this.openSnackBar(`Result: ${formattedResult}`);
      } catch (error) {
        if (error instanceof Error) {
          this.openSnackBar(error.message);
        }
      }
    } else {
      this.openSnackBar('Values must be numbers and greater than zero');
    }
  }

  public openSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 2000 });
  }

  public handleStatusErrors(): void {
    for (const field in this.formGroup.controls) {
      this.handleErrors(field);
    }
  }

  public handleErrors(field: string): void {
    const input = this.formGroup.get(field);
    let errors: InputErrors = this.formGroup.errors || {};

    if (input?.hasError('required')) {
      errors = {
        ...errors,
        [field]: {
          ...errors[field],
          isRequired: true,
        },
      };
    }

    if (input?.hasError('min')) {
      errors = {
        ...errors,
        [field]: {
          ...errors[field],
          isNotMin: true,
        },
      };
    }

    this.formGroup.setErrors(errors);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
