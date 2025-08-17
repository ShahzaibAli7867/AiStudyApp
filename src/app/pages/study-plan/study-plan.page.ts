import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { StudyPlan, StudyPlanStorageService, StudyTask } from 'src/app/services/study-plan-storage.service';
import { v4 as uuidv4 } from 'uuid';
//import { StudyPlanStorageService, StudyPlan, StudyTask } from '../services/study-plan-storage.service';

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plan.page.html',
  styleUrls: ['./study-plan.page.scss'],
  standalone:false,
})
export class StudyPlanPage implements OnInit {
  studyPlan: StudyPlan | undefined;
  private autoSaveTimeout: any;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private studyPlanStorage: StudyPlanStorageService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const planId = this.route.snapshot.paramMap.get('planId');

    if (planId) {
      const loadedPlan = await this.studyPlanStorage.getPlanById(planId);
      if (loadedPlan) {
        this.studyPlan = loadedPlan;
      } else {
        console.warn('Study Plan not found for ID:', planId);
        this.presentToast('Study plan not found.', 'danger');
        this.navCtrl.navigateBack('/study-plan');
      }
    } else {
      this.presentToast('No study plan selected.', 'warning');
      this.navCtrl.navigateBack('/study-plan');
    }
  }

  autoSavePlan() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    this.autoSaveTimeout = setTimeout(async () => {
      if (this.studyPlan) {
        this.studyPlan.lastUpdated = Date.now();
        await this.studyPlanStorage.updatePlan(this.studyPlan);
        console.log('Study Plan auto-saved.');
      }
    }, 2000);
  }

  sortedTasks(): StudyTask[] {
    if (!this.studyPlan?.tasks) return [];
    // Sort tasks by completion status (incomplete first), then by due date
    return [...this.studyPlan.tasks].sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return a.dueDate - b.dueDate;
    });
  }

  async addOrEditTask(taskToEdit?: StudyTask) {
    const isEdit = taskToEdit !== undefined;

    const alert = await this.alertController.create({
      header: isEdit ? 'Edit Task' : 'Add New Task',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: isEdit ? taskToEdit?.title : '',
          placeholder: 'Task Title (e.g., "Read Chapter 5")',
        },
        {
          name: 'description',
          type: 'textarea',
          value: isEdit ? taskToEdit?.description : '',
          placeholder: 'Optional Description',
        },
        {
          name: 'dueDate',
          type: 'datetime-local', // Allows date and time selection
          value: isEdit ? new Date(taskToEdit!.dueDate).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
          placeholder: 'Due Date & Time',
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Low',
          value: 'low',
          checked: isEdit && taskToEdit?.priority === 'low'
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'Medium',
          value: 'medium',
          checked: (isEdit && taskToEdit?.priority === 'medium') || (!isEdit)
        },
        {
          name: 'priority',
          type: 'radio',
          label: 'High',
          value: 'high',
          checked: isEdit && taskToEdit?.priority === 'high'
        },
        {
          name: 'category',
          type: 'text',
          value: isEdit ? taskToEdit?.category : '',
          placeholder: 'Category (optional, e.g., "Math")',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: isEdit ? 'Update' : 'Add',
          handler: (data:any) => {
            if (data.title && data.title.trim() && data.dueDate && this.studyPlan) {
              const taskDueDate = new Date(data.dueDate).getTime();
              if (isEdit && taskToEdit) {
                taskToEdit.title = data.title.trim();
                taskToEdit.description = data.description?.trim() || '';
                taskToEdit.dueDate = taskDueDate;
                taskToEdit.priority = data.priority;
                taskToEdit.category = data.category?.trim() || '';
                // No need to explicitly update task, it's a reference. Auto-save will handle persistence.
                this.presentToast('Task updated!', 'success');
              } else {
                const newTask: StudyTask = {
                  id: uuidv4(),
                  title: data.title.trim(),
                  description: data.description?.trim() || '',
                  dueDate: taskDueDate,
                  completed: false,
                  priority: data.priority,
                  category: data.category?.trim() || '',
                };
                this.studyPlan.tasks.push(newTask);
                this.presentToast('Task added!', 'success');
              }
              this.autoSavePlan();
              return true;
            } else {
              this.presentToast('Task title and due date are required.', 'danger');
              return false; // Keep the alert open
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async toggleTaskCompletion(task: StudyTask) {
    if (this.studyPlan) {
      task.completed = !task.completed;
      this.autoSavePlan();
      this.presentToast(`Task marked as ${task.completed ? 'completed' : 'incomplete'}!`, 'success');
    }
  }

  async deleteTask(taskId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            if (this.studyPlan) {
              this.studyPlan.tasks = this.studyPlan.tasks.filter((task) => task.id !== taskId);
              this.autoSavePlan();
              this.presentToast('Task deleted!', 'success');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}