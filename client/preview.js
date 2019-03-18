import React from 'react'
import Vue from 'vue'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.vueElement = React.createRef()
    this.vueNode = null
    this.data = null
    this.updateData()
  }

  static vueComponent = null

  get vueComponent() {
    return this.vueNode.componentInstance
  }

  componentDidMount() {
    this.vue = new Vue({
      el: this.vueElement.current,
      components: { Preview: this.constructor.vueComponent },
      render: h => (this.vueNode = h('Preview', { props: this.data }))
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
      const value = data[key]
      let asset

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
    return class extends this { static vueComponent = component }
  }
}
