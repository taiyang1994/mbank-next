import CubePicker from '../../components/picker/picker.vue'
import addPicker from './api'
import Locale from '../../common/locale'

CubePicker.install = function (Vue) {
  Vue.component(CubePicker.name, CubePicker)
  Locale.install(Vue)
  addPicker(Vue, CubePicker)
}

export default CubePicker
