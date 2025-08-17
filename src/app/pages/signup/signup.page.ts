import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular'; // Import ToastController for notifications

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
strength: any;
passwordMismatch: any;
isInvalid(arg0: string): any {
throw new Error('Method not implemented.');
}
  signupForm!: FormGroup;
  signupSuccess: boolean = false;
  loadingController: any;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController // Inject ToastController
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSignup() {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.value;
      console.log('Signup Data:', { fullName, email, password });

      // Simulate a successful signup or an API call
      // In a real application, you would send this data to your backend
      // and handle the response.

      const toast = await this.toastController.create({
        message: 'Signup successful! Redirecting to login...',
        duration: 2000,
        position: 'top',
        color: 'success'
      });
      toast.present();

      // Redirect to login page after a short delay
      setTimeout(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }, 2000);

    } else {  
      const toast = await this.toastController.create({
        message: 'Please fill in all required fields correctly.',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }




  async onGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Connecting with Google...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.toastController.create({
        header: 'Info',
        message: 'Google login integration would be implemented here.',
        buttons: ['OK']
      });
      await alert.present();
    }, 1500);
  }

  async onFacebookLogin() {
    const loading = await this.loadingController.create({
      message: 'Connecting with Facebook...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.toastController.create({
        header: 'Info',
        message: 'Facebook login integration would be implemented here.',
        buttons: ['OK']
      });
      await alert.present();
    }, 1500);
  }

   checkPasswordStrength() {
    const pwd = this.signupForm.get('password')?.value || '';
    this.strength = Math.min((pwd.length / 12) * 100, 100);
  }
}