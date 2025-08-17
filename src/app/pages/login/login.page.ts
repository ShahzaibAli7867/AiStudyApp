import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Navigate to signup page
  navigateToSignup() {
    this.router.navigate(['/signup'], { replaceUrl: true });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Handle login form submission
  async onLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Logging in...',
        duration: 2000
      });
      await loading.present();

      // Simulate login delay (replace with real API call in production)
      setTimeout(async () => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Login successful!',
          buttons: ['OK']
        });
        await alert.present();
        await alert.onDidDismiss();
        this.router.navigate(['/home'], { replaceUrl: true });
      }, 2000);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please fill in all required fields correctly.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Simulate Google login
  async onGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Connecting with Google...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Info',
        message: 'Google login integration would be implemented here.',
        buttons: ['OK']
      });
      await alert.present();
    }, 1500);
  }

  // Simulate Facebook login
  async onFacebookLogin() {
    const loading = await this.loadingController.create({
      message: 'Connecting with Facebook...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Info',
        message: 'Facebook login integration would be implemented here.',
        buttons: ['OK']
      });
      await alert.present();
    }, 1500);
  }

  // Simulate forgot password
  async onForgotPassword() {
    const alert = await this.alertController.create({
      header: 'Reset Password',
      message: 'Password reset functionality would be implemented here.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
