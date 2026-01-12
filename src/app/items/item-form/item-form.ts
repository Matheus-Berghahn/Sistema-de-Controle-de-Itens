import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemsService } from '../items.service';
import { Item, VALIDACOES_TRIBUNAL, MENSAGENS_ERRO } from '../../models/item.model';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './item-form.html',
  styleUrls: ['./item-form.scss']
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  isEditMode: boolean = false;
  itemId?: number;
  carregando: boolean = false;

  tipos = [
    { value: 'MATERIAL', label: 'Material' },
    { value: 'SERVICO', label: 'Serviço' },
    { value: 'OUTROS', label: 'Outros' }
  ];

  orgaos = [
    'Secretaria de Educação',
    'Secretaria de Saúde',
    'Secretaria de Segurança',
    'Secretaria de Finanças',
    'Secretaria de Administração'
  ];

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.itemForm = this.criarForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.carregarItem(this.itemId);
      }
    });
  }

  criarForm(): FormGroup {
    return this.fb.group({
      codigo: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(VALIDACOES_TRIBUNAL.codigoPattern)
      ]],
      descricao: ['', [
        Validators.required, 
        Validators.maxLength(200),
        Validators.minLength(10)
      ]],
      tipo: ['MATERIAL', Validators.required],
      valorUnitario: ['', [
        Validators.required, 
        Validators.min(0.01),
        Validators.max(9999999.99)
      ]],
      quantidade: ['', [
        Validators.required, 
        Validators.min(1),
        Validators.max(999999)
      ]],
      orgaoResponsavel: ['', Validators.required],
      processo: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(VALIDACOES_TRIBUNAL.processoPattern)
      ]],
      numeroProcesso: ['', [
        Validators.maxLength(30),
        Validators.pattern(VALIDACOES_TRIBUNAL.numeroProcessoPattern)
      ]],
      exercicioFiscal: [new Date().getFullYear(), [
        Validators.required,
        Validators.min(2000),
        Validators.max(2050)
      ]],
      unidadeOrcamentaria: ['', [
        Validators.pattern(VALIDACOES_TRIBUNAL.unidadeOrcamentariaPattern)
      ]],
      fonteRecurso: ['', [
        Validators.pattern(VALIDACOES_TRIBUNAL.fonteRecursoPattern)
      ]]
    });
  }

  carregarItem(id: number): void {
    this.carregando = true;
    this.itemsService.getItem(id).subscribe({
      next: (item) => {
        this.itemForm.patchValue(item);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mostrarErro('Erro ao carregar item');
        this.carregando = false;
        this.cdr.detectChanges(); 
        console.error('Erro:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.marcarTodosComoSujos();
      return;
    }

    this.carregando = true;
    const itemData: Item = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      // Editar
      this.itemsService.updateItem(this.itemId, itemData).subscribe({
        next: () => {
          this.mostrarSucesso('Item atualizado com sucesso!');
          this.router.navigate(['/items']);
        },
        error: (error) => {
          this.mostrarErro('Erro ao atualizar item');
          this.carregando = false;
          this.cdr.detectChanges();
          console.error('Erro:', error);
        }
      });
    } else {
      // Criar
      this.itemsService.createItem(itemData).subscribe({
        next: () => {
          this.mostrarSucesso('Item criado com sucesso!');
          this.router.navigate(['/items']);
        },
        error: (error) => {
          this.mostrarErro('Erro ao criar item');
          this.carregando = false;
          this.cdr.detectChanges();
          console.error('Erro:', error);
        }
      });
    }
  }

  marcarTodosComoSujos(): void {
    Object.keys(this.itemForm.controls).forEach(key => {
      const control = this.itemForm.get(key);
      control?.markAsTouched();
    });
  }

  cancelar(): void {
    this.router.navigate(['/items']);
  }

  get f() {
    return this.itemForm.controls;
  }

  getErrorMessage(campo: string): string {
    const control = this.itemForm.get(campo);
    
    if (!control || !control.errors) return '';
    
    if (control.hasError('required')) {
      return 'Campo obrigatório';
    }
    
    if (control.hasError('pattern')) {
      switch(campo) {
        case 'codigo': return MENSAGENS_ERRO.codigo;
        case 'processo': return MENSAGENS_ERRO.processo;
        case 'numeroProcesso': return MENSAGENS_ERRO.numeroProcesso;
        case 'unidadeOrcamentaria': return MENSAGENS_ERRO.unidadeOrcamentaria;
        case 'fonteRecurso': return MENSAGENS_ERRO.fonteRecurso;
        default: return 'Formato inválido';
      }
    }
    
    if (control.hasError('min')) {
      if (campo === 'valorUnitario') return MENSAGENS_ERRO.valorMinimo;
      if (campo === 'quantidade') return MENSAGENS_ERRO.quantidadeMinima;
      return 'Valor abaixo do mínimo permitido';
    }
    
    if (control.hasError('max')) {
      return 'Valor acima do máximo permitido';
    }
    
    if (control.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength']?.requiredLength} caracteres`;
    }
    
    if (control.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength']?.requiredLength} caracteres`;
    }
    
    return 'Campo inválido';
  }

  private mostrarSucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      panelClass: ['sucesso-snackbar']
    });
  }

  private mostrarErro(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 5000,
      panelClass: ['erro-snackbar']
    });
  }
}