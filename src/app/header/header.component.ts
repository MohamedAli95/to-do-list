import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuth = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userIsAuth = this.authService.getIsAuth();
    console.log(this.authService.getIsAuth());
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userIsAuth = isAuth;
    });
  }
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/']));
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
