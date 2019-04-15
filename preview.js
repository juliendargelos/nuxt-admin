import React from 'react'
import Vue from 'vue'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.vueElement = React.createRef()
    this.data = null
    this.updateData()
    console.log(this.constructor.vueComponent)
    this.constructor.vueComponent.props = Object.keys(this.data)
  }

  componentDidMount() {
    this.vue = new Vue({
      el: this.vueElement.current,
      components: { Preview: this.constructor.vueComponent },
      render: h => h('Preview', { props: this.data })
    })
  }

  componentWillUnmount() {
    this.vue.$destroy()
  }

  componentDidUpdate() {
    this.updateData()
    this.updateVue()
  }

  updateData() {
    this.data = this.constructor.retrieveAssets(
      this.props.getAsset,
      this.props.entry.get('data').toJS()
    )
  }

  updateVue() {
    this.vue.$forceUpdate()
  }

  render() {
    return React.createElement('div', { ref: this.vueElement })
  }

  static retrieveAssets(getAsset, data) {
    Object.keys(data).forEach((key) => {
      let asset
      const value = data[key]

      try {
        asset = getAsset(value)
      } catch (e) {

      }

      if (asset && asset.file) {
        data[key] = URL.createObjectURL(asset.fileObj)
      } else if ((typeof value !== 'object' || value === null) && !Array.isArray(value)) {
        data[key] = value
      } else {
        data[key] = this.retrieveAssets(getAsset, value)
      }
    })

    return data
  }

  static for(component) {
    const preview = class extends this {}
    preview.vueComponent = component
    return preview
  }
}
