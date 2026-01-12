export interface Item {
  id?: number;
  codigo: string;
  descricao: string;
  tipo: 'MATERIAL' | 'SERVICO' | 'OUTROS';
  valorUnitario: number;
  quantidade: number;
  dataCadastro?: string;
  usuarioCadastro?: string;
  orgaoResponsavel: string;
  processo: string;
  numeroProcesso?: string;
  exercicioFiscal?: number;
  unidadeOrcamentaria?: string;
  fonteRecurso?: string;
}

// Validações específicas para Tribunal
export interface ValidacaoTribunal {
  codigoPattern: RegExp;
  processoPattern: RegExp;
  numeroProcessoPattern: RegExp;
  unidadeOrcamentariaPattern: RegExp;
  fonteRecursoPattern: RegExp;
}

export const VALIDACOES_TRIBUNAL: ValidacaoTribunal = {
  // Formato: AAA-SSS-NNN (Ano-Sigla-Número)
  codigoPattern: /^\d{4}-[A-Z]{3,5}-\d{3,6}$/,
  
  // Formato: TIPO NNN/AAAA
  processoPattern: /^(PREGÃO|DISPENSA|INEXIGIBILIDADE|CONCORRÊNCIA)\s+\d{1,6}\/\d{4}$/i,
  
  // Formato: NNNNNNNNN-NN.NNNN.N.NN.NN.NN
  numeroProcessoPattern: /^\d{5,11}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{2}\.\d{2}$/,
  
  // Formato: 999999 (6 dígitos)
  unidadeOrcamentariaPattern: /^\d{6}$/,
  
  // Formato: 999999 (6 dígitos)
  fonteRecursoPattern: /^\d{6}$/
};

// Mensagens de erro padronizadas
export const MENSAGENS_ERRO = {
  codigo: 'Formato: AAAA-SIGLA-NNNN (Ex: 2024-MAT-001)',
  processo: 'Formato: TIPO NNN/AAAA (Ex: PREGÃO 001/2024)',
  numeroProcesso: 'Formato: NNNNN-NN.NNNN.N.NN.NN.NN',
  unidadeOrcamentaria: '6 dígitos numéricos',
  fonteRecurso: '6 dígitos numéricos',
  valorMinimo: 'Valor mínimo: R$ 0,01',
  quantidadeMinima: 'Quantidade mínima: 1'
};