class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compiler(this.el)
  }
  compiler(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compilerText(node)
      } else if (this.isElementNode(node)) {
        this.compilerElement(node)
      }
      // 如果node节点还有字节的，递归调用compiler
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node)
      } 
    })
  }
  compilerElement(node) {
    // console.log(node.attributes)
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn(node, this.vm[key])
  }
  // 处理v-text指令
  textUpdater(node, value) {
    node.textContent = value
  }
  // 处理v-model
  modelUpdater(node, value) {
    node.value = value
  }
  compilerText(node) {
    // console.dir(node)
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      const key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
}