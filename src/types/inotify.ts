type typesNotify = 'success' | 'info' | 'warning' | 'error'
type colorsNotify = 'orange' | 'yellow' | 'green' | 'blue' | 'purple';
type bordersNotify = 'left' | 'right' | 'top' | 'bottom';

export interface INotify {
  type?: typesNotify;
  color?: colorsNotify;
  border?: bordersNotify;
  elevation?: number;
  icon?: string;
  content?: string;
  snackbar?: {
    [key: string]: string | boolean | number;
  };
}
