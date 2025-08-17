import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StudyPlan, StudyPlanStorageService } from 'src/app/services/study-plan-storage.service';
//import { StudyPlanStorageService, StudyPlan } from '../services/study-plan-storage.service';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

@Component({
  selector: 'app-study-plans-overview',
  templateUrl: './study-plans-overview.page.html',
  styleUrls: ['./study-plans-overview.page.scss'],
  standalone:false,
})
export class StudyPlansOverviewPage implements OnInit {
  studyPlans: StudyPlan[] = [];

  constructor(
    private studyPlanStorage: StudyPlanStorageService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadPlans();
  }

  ionViewWillEnter() {
    this.loadPlans(); // Reload every time the view enters
  }

  async loadPlans() {
    this.studyPlans = await this.studyPlanStorage.getAllPlans();
  }

  openPlan(planId: string) {
    this.navCtrl.navigateForward(`/study-plan/${planId}`);
  }

  async createNewPlan() {
    const alert = await this.alertController.create({
      header: 'Create New Study Plan',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Plan Title (e.g., "Midterm Prep")',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Optional Description',
        },
        {
          name: 'startDate',
          type: 'date',
          value: new Date().toISOString().substring(0, 10), // Default to today
          placeholder: 'Start Date',
        },
        {
          name: 'endDate',
          type: 'date',
          value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // Default to 7 days from now
          placeholder: 'End Date',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Create',
          handler: async (data) => {
            if (data.title && data.title.trim() !== '' && data.startDate && data.endDate) {
              const newPlan: StudyPlan = {
                id: uuidv4(),
                title: data.title.trim(),
                description: data.description?.trim() || '',
                startDate: new Date(data.startDate).getTime(),
                endDate: new Date(data.endDate).getTime(),
                tasks: [],
                createdAt: Date.now(),
                lastUpdated: Date.now(),
                pinned: false,
              };
              await this.studyPlanStorage.savePlan(newPlan);
              await this.loadPlans(); // Refresh list
              this.openPlan(newPlan.id); // Go directly to the new plan's editor
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async editPlanDetails(plan: StudyPlan) {
    const alert = await this.alertController.create({
      header: 'Edit Plan Details',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: plan.title,
          placeholder: 'Plan Title',
        },
        {
          name: 'description',
          type: 'textarea',
          value: plan.description,
          placeholder: 'Optional Description',
        },
        {
          name: 'startDate',
          type: 'date',
          value: new Date(plan.startDate).toISOString().substring(0, 10),
          placeholder: 'Start Date',
        },
        {
          name: 'endDate',
          type: 'date',
          value: new Date(plan.endDate).toISOString().substring(0, 10),
          placeholder: 'End Date',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            if (data.title && data.title.trim() !== '') {
              plan.title = data.title.trim();
              plan.description = data.description?.trim() || '';
              plan.startDate = new Date(data.startDate).getTime();
              plan.endDate = new Date(data.endDate).getTime();
              await this.studyPlanStorage.updatePlan(plan);
              await this.loadPlans(); // Refresh list
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async deletePlan(planId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this study plan and all its tasks?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.studyPlanStorage.deletePlan(planId);
            await this.loadPlans(); // Reload to remove the deleted plan
          },
        },
      ],
    });
    await alert.present();
  }

  async togglePin(planId: string, event: Event) {
    event.stopPropagation(); // Prevent item click from firing
    await this.studyPlanStorage.togglePinPlan(planId);
    await this.loadPlans(); // Reload to reflect pin status and sorting
  }

  getCompletedTasksCount(plan: StudyPlan): number {
    return plan.tasks.filter(task => task.completed).length;
  }
}