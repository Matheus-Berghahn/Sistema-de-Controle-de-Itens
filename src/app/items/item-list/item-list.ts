import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../items.service';
import { ExportService } from '../../services/export.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './item-list.html',
  styleUrls: ['./item-list.scss']
})
export class ItemListComponent implements OnInit {
  itens: Item[] = [];
  itensFiltrados: Item[] = [];
  carregando: boolean = true;
  
  // Seleção de itens
  itensSelecionados = new Set<number>();
  selecionarTodos: boolean = false;
  
  // Colunas da tabela (com seleção)
  displayedColumns: string[] = ['selecao', 'codigo', 'descricao', 'tipo', 'valor', 'quantidade', 'orgao', 'data', 'acoes'];
  
  // Filtros
  filtroBusca: string = '';
  filtroTipo: string = 'TODOS';
  filtroOrgao: string = 'TODOS';
  filtroValorMin: number | null = null;
  filtroValorMax: number | null = null;
  panelFiltrosAberto = false;
  
  // Opções para filtros
  tipos = ['TODOS', 'MATERIAL', 'SERVICO', 'OUTROS'];
  orgaosUnicos: string[] = [];
  
  constructor(
    private itemsService: ItemsService,
    private exportService: ExportService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    
    this.itemsService.getItems().subscribe({
      next: (data) => {
        this.itens = data;
        this.itensFiltrados = [...data];
        
        // Extrair órgãos únicos para o filtro
        this.orgaosUnicos = ['TODOS', ...new Set(data.map(item => item.orgaoResponsavel))];
        
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.mostrarErro('Erro ao carregar itens');
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    let filtrados = [...this.itens];
    
    // Filtro de busca (texto livre)
    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      filtrados = filtrados.filter(item => 
        item.codigo.toLowerCase().includes(busca) ||
        item.descricao.toLowerCase().includes(busca) ||
        item.processo.toLowerCase().includes(busca) ||
        item.orgaoResponsavel.toLowerCase().includes(busca)
      );
    }
    
    // Filtro por tipo
    if (this.filtroTipo !== 'TODOS') {
      filtrados = filtrados.filter(item => item.tipo === this.filtroTipo);
    }
    
    // Filtro por órgão
    if (this.filtroOrgao !== 'TODOS') {
      filtrados = filtrados.filter(item => item.orgaoResponsavel === this.filtroOrgao);
    }
    
    // Filtro por valor mínimo
    if (this.filtroValorMin !== null) {
      filtrados = filtrados.filter(item => item.valorUnitario >= this.filtroValorMin!);
    }
    
    // Filtro por valor máximo
    if (this.filtroValorMax !== null) {
      filtrados = filtrados.filter(item => item.valorUnitario <= this.filtroValorMax!);
    }
    
    this.itensFiltrados = filtrados;
    
    // Limpar seleção quando filtrar
    this.itensSelecionados.clear();
    this.selecionarTodos = false;
  }
  
  limparFiltros(): void {
    this.filtroBusca = '';
    this.filtroTipo = 'TODOS';
    this.filtroOrgao = 'TODOS';
    this.filtroValorMin = null;
    this.filtroValorMax = null;
    this.itensFiltrados = [...this.itens];
    
    // Limpar seleção
    this.itensSelecionados.clear();
    this.selecionarTodos = false;
  }
  
  get filtrosAtivos(): boolean {
    return this.filtroBusca !== '' || 
           this.filtroTipo !== 'TODOS' || 
           this.filtroOrgao !== 'TODOS' || 
           this.filtroValorMin !== null || 
           this.filtroValorMax !== null;
  }
  
  get contadorFiltrado(): string {
    if (this.itensFiltrados.length === this.itens.length) {
      return `${this.itens.length} itens`;
    }
    return `${this.itensFiltrados.length} de ${this.itens.length} itens`;
  }

  // Métodos de seleção
  toggleSelecionarItem(itemId: number): void {
    if (this.itensSelecionados.has(itemId)) {
      this.itensSelecionados.delete(itemId);
    } else {
      this.itensSelecionados.add(itemId);
    }
    this.atualizarSelecionarTodos();
  }

  toggleSelecionarTodos(): void {
    if (this.selecionarTodos) {
      // Desmarcar todos os itens filtrados
      this.itensFiltrados.forEach(item => {
        if (item.id) this.itensSelecionados.delete(item.id);
      });
    } else {
      // Marcar todos os itens filtrados
      this.itensFiltrados.forEach(item => {
        if (item.id) this.itensSelecionados.add(item.id);
      });
    }
    this.selecionarTodos = !this.selecionarTodos;
  }

  atualizarSelecionarTodos(): void {
    if (this.itensFiltrados.length === 0) {
      this.selecionarTodos = false;
      return;
    }
    
    const todosSelecionados = this.itensFiltrados.every(item => 
      item.id && this.itensSelecionados.has(item.id)
    );
    this.selecionarTodos = todosSelecionados;
  }

  estaSelecionado(itemId: number): boolean {
    return this.itensSelecionados.has(itemId);
  }

  get quantidadeSelecionada(): number {
    return this.itensSelecionados.size;
  }

  // Métodos de exportação
  exportarSelecionadosPDF(): void {
    if (this.quantidadeSelecionada === 0) {
      this.snackBar.open('Selecione pelo menos um item para exportar', 'Fechar', {
        duration: 3000,
        panelClass: ['erro-snackbar']
      });
      return;
    }

    // Obter itens selecionados completos
    const itensParaExportar = this.itens.filter(item => 
      item.id && this.itensSelecionados.has(item.id)
    );

    const titulo = this.quantidadeSelecionada === this.itens.length 
      ? 'Relatório Completo de Itens' 
      : `Relatório de Itens Selecionados (${this.quantidadeSelecionada} itens)`;

    this.exportService.gerarPDFItens(itensParaExportar, titulo);
    
    this.snackBar.open(`PDF gerado com ${this.quantidadeSelecionada} itens`, 'Fechar', {
      duration: 3000,
      panelClass: ['sucesso-snackbar']
    });
  }

  exportarTodosPDF(): void {
    const titulo = 'Relatório Completo de Itens';
    this.exportService.gerarPDFItens(this.itensFiltrados, titulo);
    
    this.snackBar.open(`PDF gerado com ${this.itensFiltrados.length} itens`, 'Fechar', {
      duration: 3000,
      panelClass: ['sucesso-snackbar']
    });
  }

  // Métodos existentes
  excluirItem(id: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.itemsService.deleteItem(id).subscribe({
        next: () => {
          this.itens = this.itens.filter(item => item.id !== id);
          this.itensFiltrados = this.itensFiltrados.filter(item => item.id !== id);
          
          // Remover da seleção se estava selecionado
          this.itensSelecionados.delete(id);
          this.atualizarSelecionarTodos();
          
          this.mostrarSucesso('Item excluído com sucesso!');
        },
        error: (error) => {
          this.mostrarErro('Erro ao excluir item');
          console.error('Erro:', error);
        }
      });
    }
  }

  formatarData(dataString?: string): string {
    if (!dataString) return 'N/A';
    return new Date(dataString).toLocaleDateString('pt-BR');
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  getTipoColor(tipo: string): string {
    switch (tipo) {
      case 'MATERIAL': return 'primary';
      case 'SERVICO': return 'accent';
      case 'OUTROS': return 'warn';
      default: return '';
    }
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