import Vue from 'vue'

Vue.mixin({
  props: {
    _admin: {
      type: Object,
      default: null
    }
  },

  created() {
    this._admin && Object.assign(this, this._admin)
  }
})
