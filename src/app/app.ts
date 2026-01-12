import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule ,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <!-- Logo/Home -->
      <button mat-icon-button routerLink="/items" class="logo-button" aria-label="Página inicial">
        <mat-icon>home</mat-icon>
      </button>
      
      <!-- Título - Mostra em desktop, esconde em mobile -->
      <span class="toolbar-title desktop-only">Sistema de Controle de Itens</span>
      <span class="toolbar-title mobile-only">Controle de Itens</span>
      
      <span class="spacer"></span>
      
      <!-- Menu Desktop -->
      <div class="desktop-only menu-flex">
        <button mat-button routerLink="/items" class="nav-button">
          <mat-icon>list</mat-icon>
          Itens
        </button>
        <button mat-button routerLink="/items/novo" class="nav-button">
          <mat-icon>add</mat-icon>
          Novo Item
        </button>
      </div>
      
      <!-- Menu Mobile (ícone de menu) -->
      <div class="mobile-only">
        <button mat-icon-button [matMenuTriggerFor]="mobileMenu" aria-label="Menu mobile">
          <mat-icon>menu</mat-icon>
        </button>
        <mat-menu #mobileMenu="matMenu">
          <button mat-menu-item routerLink="/items">
            <mat-icon>list</mat-icon>
            <span>Itens</span>
          </button>
          <button mat-menu-item routerLink="/items/novo">
            <mat-icon>add</mat-icon>
            <span>Novo Item</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon>account_circle</mat-icon>
            <span>Perfil</span>
          </button>
        </mat-menu>
      </div>
      
      <!-- Ícone de usuário (só em desktop) -->
      <button mat-icon-button class="desktop-only" aria-label="Perfil do usuário">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    /* Toolbar geral */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 0 16px;
      height: 64px;
    }
    
    /* Logo/Home */
    .logo-button {
      margin-right: 16px;
    }
    
    /* Título */
    .toolbar-title {
      font-weight: 500;
      font-size: 1.1rem;
    }
    
    .mobile-only {
      display: none;
    }
    
    /* Espaçador */
    .spacer {
      flex: 1 1 auto;
    }
    
    /* Botões de navegação desktop */
    .nav-button {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 8px;
    }
    
    /* Conteúdo principal */
    .main-content {
      min-height: calc(100vh - 64px);
      background-color: #fafafa;
    }
    
    /* ============ RESPONSIVIDADE ============ */
    
    /* Tablet */
    @media (max-width: 1024px) {
      .toolbar-title.desktop-only {
        font-size: 1rem;
      }
      
      .nav-button {
        font-size: 0.9rem;
        padding: 0 12px;
        
        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
    
    /* Mobile */
    @media (max-width: 768px) {
      .toolbar {
        padding: 0 12px;
        height: 56px;
      }
      
      .desktop-only {
        display: none !important;
      }
      
      .mobile-only {
        display: block;
      }
      
      .toolbar-title.mobile-only {
        font-size: 1rem;
        margin-left: 8px;
      }
      
      .logo-button {
        margin-right: 8px;
        
        mat-icon {
          font-size: 24px;
        }
      }
      
      .main-content {
        min-height: calc(100vh - 56px);
      }
    }
    
    /* Mobile pequeno */
    @media (max-width: 480px) {
      .toolbar {
        padding: 0 8px;
      }
      
      .toolbar-title.mobile-only {
        font-size: 0.9rem;
      }
    }
    
    /* Menu mobile estilizado */
    .mat-menu-panel {
      min-width: 200px !important;
    }
    
    .mat-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class AppComponent {
  title = 'sistema-web';
}