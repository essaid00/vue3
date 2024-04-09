import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/fr_FR';
//import momentLocale from 'moment/dist/locale/eu';

const modules = import.meta.glob('./fr/**/*.ts', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'fr'),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'fr',
};
