import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  showModal = false;
  editingPatient: Patient | null = null;
  deleteConfirmId: number | null = null;

  form: Patient = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    email: '',
    phone: '',
    address: '',
    insuranceMemberId: ''
  };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAll(this.searchTerm || undefined).subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load patients';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadPatients();
  }

  openAddModal(): void {
    this.editingPatient = null;
    this.form = { firstName: '', lastName: '', dateOfBirth: '', gender: 'MALE', email: '', phone: '', address: '', insuranceMemberId: '' };
    this.showModal = true;
  }

  openEditModal(patient: Patient): void {
    this.editingPatient = patient;
    this.form = { ...patient };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPatient = null;
  }

  savePatient(): void {
    if (this.editingPatient?.id) {
      this.patientService.update(this.editingPatient.id, this.form).subscribe({
        next: () => { this.closeModal(); this.loadPatients(); },
        error: () => { this.error = 'Failed to update patient'; }
      });
    } else {
      this.patientService.create(this.form).subscribe({
        next: () => { this.closeModal(); this.loadPatients(); },
        error: () => { this.error = 'Failed to create patient'; }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  deletePatient(): void {
    if (this.deleteConfirmId) {
      this.patientService.delete(this.deleteConfirmId).subscribe({
        next: () => { this.deleteConfirmId = null; this.loadPatients(); },
        error: () => { this.error = 'Failed to delete patient'; }
      });
    }
  }

  getAge(dob: string | undefined): number {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }
}
