import { format } from 'date-fns';

// Установка 2020 года в связи с временными данными за 20-й год.
export const formatDate = (date: Date) => format(date.setFullYear(2020), 'yyyy-MM-dd HH:mm:ss');
