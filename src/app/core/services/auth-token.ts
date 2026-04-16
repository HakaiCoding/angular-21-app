import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthToken {
  private readonly accessToken = signal<string | null>(null);

  readonly token: Signal<string | null> = this.accessToken.asReadonly();

  setToken(token: string): void {
    this.accessToken.set(token);
  }

  clearToken(): void {
    this.accessToken.set(null);
  }
}
