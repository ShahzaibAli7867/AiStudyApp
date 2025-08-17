import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface StudyTask {
  id: string; // Unique ID for the task
  title: string;
  description?: string;
  dueDate: number; // Timestamp for the due date/time
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string; // e.g., "Math", "History", "Project"
  reminders?: number[]; // Array of timestamps for reminders
}

export interface StudyPlan {
  id: string; // Unique ID for the plan
  title: string;
  description?: string;
  startDate: number;
  endDate: number;
  tasks: StudyTask[]; // Array of tasks within this plan
  createdAt: number;
  lastUpdated: number;
  pinned: boolean; // Option to pin a plan
}

@Injectable({
  providedIn: 'root',
})
export class StudyPlanStorageService {
  private _storage: Storage | null = null;
  private readonly PLANS_KEY = 'study_plans'; // Key for storing all study plans

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // --- CRUD Operations for Study Plans ---

  /**
   * Saves a new study plan.
   */
  async savePlan(plan: StudyPlan): Promise<void> {
    const allPlans = (await this.getAllPlans()) || [];
    allPlans.push(plan);
    await this._storage?.set(this.PLANS_KEY, allPlans);
  }

  /**
   * Updates an existing study plan.
   */
  async updatePlan(updatedPlan: StudyPlan): Promise<void> {
    let allPlans = (await this.getAllPlans()) || [];
    const index = allPlans.findIndex((plan) => plan.id === updatedPlan.id);
    if (index > -1) {
      allPlans[index] = { ...updatedPlan, lastUpdated: Date.now() }; // Update timestamp
      await this._storage?.set(this.PLANS_KEY, allPlans);
    } else {
      console.warn('Study Plan not found for update:', updatedPlan.id);
    }
  }

  /**
   * Retrieves a single study plan by ID.
   */
  async getPlanById(id: string): Promise<StudyPlan | undefined> {
    const allPlans = (await this.getAllPlans()) || [];
    return allPlans.find((plan) => plan.id === id);
  }

  /**
   * Retrieves all study plans.
   * Returns plans sorted by lastUpdated (descending), with pinned plans first.
   */
  async getAllPlans(): Promise<StudyPlan[]> {
    const plans: StudyPlan[] = (await this._storage?.get(this.PLANS_KEY)) || [];
    return plans.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.lastUpdated - a.lastUpdated; // Newest first
    });
  }

  /**
   * Deletes a study plan by ID.
   */
  async deletePlan(id: string): Promise<void> {
    let allPlans = (await this.getAllPlans()) || [];
    allPlans = allPlans.filter((plan) => plan.id !== id);
    await this._storage?.set(this.PLANS_KEY, allPlans);
  }

  /**
   * Toggles the pinned status of a plan.
   */
  async togglePinPlan(id: string): Promise<void> {
    const allPlans = (await this.getAllPlans()) || [];
    const planToToggle = allPlans.find((plan) => plan.id === id);
    if (planToToggle) {
      planToToggle.pinned = !planToToggle.pinned;
      await this.updatePlan(planToToggle);
    }
  }

  // --- Study Task Operations within a Plan (Delegated to plan update for simplicity) ---
  // Adding/updating/deleting tasks will typically be handled by loading the plan,
  // modifying its `tasks` array, and then calling `updatePlan`.
  // This avoids having separate CRUD for tasks, keeping them nested under a plan.
}