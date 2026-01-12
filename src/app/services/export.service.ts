import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  gerarPDFItens(itens: Item[], titulo: string = 'Relatório de Itens'): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    
    // Cabeçalho do Tribunal
    this.adicionarCabecalho(doc, titulo, dataAtual, horaAtual, itens.length, pageWidth, margin);
    
    // Tabela de itens (manual)
    this.adicionarTabelaItensManual(doc, itens, pageWidth, margin);
    
    // Rodapé
    this.adicionarRodape(doc, pageWidth);
    
    // Salvar PDF
    doc.save(`relatorio_itens_${dataAtual.replace(/\//g, '-')}.pdf`);
  }
  
  private adicionarCabecalho(
    doc: jsPDF, 
    titulo: string, 
    data: string, 
    hora: string,
    totalItens: number,
    pageWidth: number,
    margin: number
  ): void {
    // Logo/Texto do Tribunal (simulado)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TRIBUNAL DE CONTAS', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Sistema de Controle de Itens Patrimoniais', pageWidth / 2, 28, { align: 'center' });
    
    // Linha divisória
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    // Título do relatório
    doc.setFontSize(14);
    doc.text(titulo, pageWidth / 2, 45, { align: 'center' });
    
    // Data e hora
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${data} às ${hora}`, pageWidth / 2, 55, { align: 'center' });
    
    // Total de itens
    doc.setFontSize(9);
    doc.text(`Total de itens: ${this.formatarNumero(totalItens)}`, margin, 65);
  }
  
  private adicionarTabelaItensManual(doc: jsPDF, itens: Item[], pageWidth: number, margin: number): void {
    let yPos = 75;
    const colWidths = [20, 45, 18, 25, 15, 30, 30]; // Larguras das colunas
    const headers = ['Código', 'Descrição', 'Tipo', 'Valor', 'Qtd', 'Órgão', 'Processo'];
    
    // Cabeçalho da tabela
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let xPos = margin;
    headers.forEach((header, index) => {
      doc.rect(xPos, yPos, colWidths[index], 8, 'F');
      doc.text(header, xPos + 2, yPos + 5);
      xPos += colWidths[index];
    });
    
    yPos += 8;
    
    // Conteúdo da tabela
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    itens.forEach((item, rowIndex) => {
      // Verificar se precisa de nova página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Alternar cor de fundo
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        let xPos = margin;
        colWidths.forEach(width => {
          doc.rect(xPos, yPos, width, 10, 'F');
          xPos += width;
        });
      }
      
      // Dados da linha
      const rowData = [
        this.truncarTexto(item.codigo, 12),
        this.truncarTexto(item.descricao, 30),
        item.tipo.substring(0, 3),
        this.formatarMoeda(item.valorUnitario),
        item.quantidade.toString(),
        this.truncarTexto(item.orgaoResponsavel, 15),
        this.truncarTexto(item.processo, 15)
      ];
      
      let xPos = margin;
      rowData.forEach((text, colIndex) => {
        doc.text(text, xPos + 2, yPos + 6);
        xPos += colWidths[colIndex];
      });
      
      yPos += 10;
    });
  }
  
  private adicionarRodape(doc: jsPDF, pageWidth: number): void {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Linha do rodapé
      doc.setLineWidth(0.2);
      doc.line(15, 280, pageWidth - 15, 280);
      
      // Texto do rodapé
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Página ${i} de ${pageCount} • Sistema de Controle Patrimonial • ${new Date().toLocaleDateString('pt-BR')}`,
        pageWidth / 2,
        285,
        { align: 'center' }
      );
    }
  }
  
  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor);
  }
  
  private formatarNumero(numero: number): string {
    return new Intl.NumberFormat('pt-BR').format(numero);
  }
  
  private truncarTexto(texto: string, maxLength: number): string {
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength - 3) + '...';
  }
}